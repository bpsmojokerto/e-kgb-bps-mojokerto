const cron = require('node-cron');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const nodemailer = require('nodemailer');
const winston = require('winston');
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Inisialisasi Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Konfigurasi Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Konfigurasi Email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Schema MongoDB untuk Job Status
const jobStatusSchema = new mongoose.Schema({
  jobId: String,
  schedule: String,
  lastRun: Date,
  status: String,
  error: String,
  nextRun: Date,
  executionCount: Number,
  githubRepo: String,
  supabaseTable: String
});

const JobStatus = mongoose.model('JobStatus', jobStatusSchema);

// Kelas CronJobSuper
class CronJobSuper {
  constructor(config) {
    this.config = {
      mongoUri: process.env.MONGO_URI,
      checkInterval: 60000,
      retryAttempts: 3,
      retryDelay: 5000,
      ...config
    };
    
    this.jobs = new Map();
    this.isRunning = false;
    this.healthCheckInterval = null;
    this.githubAuth = {
      username: process.env.GITHUB_USERNAME,
      password: process.env.GITHUB_PASSWORD
    };
  }

  async initialize() {
    try {
      await mongoose.connect(this.config.mongoUri);
      logger.info('MongoDB connected successfully');
      
      // Verifikasi koneksi Supabase
      const { data, error } = await supabase.from('_health').select('*').limit(1);
      if (error) throw error;
      logger.info('Supabase connected successfully');
      
      // Mulai health check
      this.startHealthCheck();
      
      // Mulai job scheduler
      this.startScheduler();
      
      // Setup error handling
      process.on('uncaughtException', this.handleError.bind(this));
      process.on('unhandledRejection', this.handleError.bind(this));
      
      logger.info('CronJobSuper initialized successfully');
    } catch (error) {
      logger.error('Initialization error:', error);
      throw error;
    }
  }

  async addJob(jobConfig) {
    const {
      id,
      schedule,
      task,
      retryOnFail = true,
      notifyOnFail = true,
      maxRetries = 3,
      timeout = 30000,
      githubRepo,
      supabaseTable
    } = jobConfig;

    const job = {
      id,
      schedule,
      task,
      retryOnFail,
      notifyOnFail,
      maxRetries,
      timeout,
      githubRepo,
      supabaseTable,
      status: 'pending',
      lastRun: null,
      nextRun: this.calculateNextRun(schedule),
      executionCount: 0
    };

    this.jobs.set(id, job);
    await this.saveJobStatus(job);
    logger.info(`Job ${id} added successfully`);
  }

  calculateNextRun(schedule) {
    return cron.schedule(schedule).nextDate().toDate();
  }

  async startScheduler() {
    this.isRunning = true;
    
    while (this.isRunning) {
      const now = new Date();
      
      for (const [id, job] of this.jobs) {
        if (job.nextRun <= now) {
          await this.executeJob(job);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, this.config.checkInterval));
    }
  }

  async executeJob(job) {
    const startTime = Date.now();
    let attempts = 0;
    let success = false;

    while (attempts < job.maxRetries && !success) {
      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Job timeout')), job.timeout);
        });

        // Eksekusi task dengan timeout
        await Promise.race([
          job.task(),
          timeoutPromise
        ]);

        // Jika job terkait dengan GitHub, lakukan backup
        if (job.githubRepo) {
          await this.backupToGitHub(job);
        }

        // Jika job terkait dengan Supabase, sinkronkan data
        if (job.supabaseTable) {
          await this.syncToSupabase(job);
        }

        success = true;
        job.status = 'success';
        job.lastRun = new Date();
        job.nextRun = this.calculateNextRun(job.schedule);
        job.executionCount++;

        await this.saveJobStatus(job);
        logger.info(`Job ${job.id} executed successfully`);
      } catch (error) {
        attempts++;
        logger.error(`Job ${job.id} failed (attempt ${attempts}/${job.maxRetries}):`, error);

        if (job.notifyOnFail) {
          await this.sendFailureNotification(job, error);
        }

        if (attempts < job.maxRetries && job.retryOnFail) {
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        }
      }
    }

    if (!success) {
      job.status = 'failed';
      await this.saveJobStatus(job);
    }
  }

  async saveJobStatus(job) {
    try {
      await JobStatus.findOneAndUpdate(
        { jobId: job.id },
        {
          jobId: job.id,
          schedule: job.schedule,
          lastRun: job.lastRun,
          status: job.status,
          nextRun: job.nextRun,
          executionCount: job.executionCount,
          githubRepo: job.githubRepo,
          supabaseTable: job.supabaseTable
        },
        { upsert: true }
      );
    } catch (error) {
      logger.error(`Error saving job status for ${job.id}:`, error);
    }
  }

  async sendFailureNotification(job, error) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `Cron Job Failure: ${job.id}`,
        html: `
          <h2>Job Execution Failed</h2>
          <p><strong>Job ID:</strong> ${job.id}</p>
          <p><strong>Schedule:</strong> ${job.schedule}</p>
          <p><strong>Error:</strong> ${error.message}</p>
          <p><strong>Stack Trace:</strong> ${error.stack}</p>
          <p><strong>Last Run:</strong> ${job.lastRun}</p>
          <p><strong>Next Run:</strong> ${job.nextRun}</p>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      logger.error(`Error sending failure notification for ${job.id}:`, error);
    }
  }

  async backupToGitHub(job) {
    try {
      const { data: jobData } = await JobStatus.find({ jobId: job.id });
      const backupData = JSON.stringify(jobData, null, 2);
      
      // Buat atau update file di GitHub
      const response = await axios.put(
        `https://api.github.com/repos/${this.githubAuth.username}/${job.githubRepo}/contents/backup/${job.id}.json`,
        {
          message: `Backup job ${job.id} - ${new Date().toISOString()}`,
          content: Buffer.from(backupData).toString('base64')
        },
        {
          auth: this.githubAuth
        }
      );
      
      logger.info(`GitHub backup successful for job ${job.id}`);
    } catch (error) {
      logger.error(`GitHub backup failed for job ${job.id}:`, error);
      throw error;
    }
  }

  async syncToSupabase(job) {
    try {
      const { data: jobData } = await JobStatus.find({ jobId: job.id });
      
      // Sinkronkan data ke Supabase
      const { data, error } = await supabase
        .from(job.supabaseTable)
        .upsert(jobData, { onConflict: 'jobId' });
      
      if (error) throw error;
      logger.info(`Supabase sync successful for job ${job.id}`);
    } catch (error) {
      logger.error(`Supabase sync failed for job ${job.id}:`, error);
      throw error;
    }
  }

  startHealthCheck() {
    this.healthCheckInterval = setInterval(async () => {
      try {
        // Check MongoDB connection
        await mongoose.connection.db.admin().ping();
        
        // Check disk space
        const diskSpace = await this.checkDiskSpace();
        if (diskSpace.free < 1024 * 1024 * 100) { // Less than 100MB free
          logger.warn('Low disk space warning');
          await this.sendFailureNotification(
            { id: 'system', schedule: 'health-check' },
            new Error('Low disk space')
          );
        }

        // Check memory usage
        const memoryUsage = process.memoryUsage();
        if (memoryUsage.heapUsed > 1024 * 1024 * 500) { // More than 500MB used
          logger.warn('High memory usage warning');
          await this.sendFailureNotification(
            { id: 'system', schedule: 'health-check' },
            new Error('High memory usage')
          );
        }
      } catch (error) {
        logger.error('Health check failed:', error);
        await this.sendFailureNotification(
          { id: 'system', schedule: 'health-check' },
          error
        );
      }
    }, 300000); // Check every 5 minutes
  }

  async checkDiskSpace() {
    const { exec } = require('child_process');
    return new Promise((resolve, reject) => {
      exec('df -k .', (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        const lines = stdout.split('\n');
        const values = lines[1].split(/\s+/);
        resolve({
          total: parseInt(values[1]) * 1024,
          used: parseInt(values[2]) * 1024,
          free: parseInt(values[3]) * 1024
        });
      });
    });
  }

  handleError(error) {
    logger.error('Unhandled error:', error);
    this.sendFailureNotification(
      { id: 'system', schedule: 'error-handler' },
      error
    );
  }

  async stop() {
    this.isRunning = false;
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    await mongoose.connection.close();
    logger.info('CronJobSuper stopped successfully');
  }

  // Tambahkan method untuk mendapatkan status semua job
  async getAllJobsStatus() {
    try {
      const jobs = await JobStatus.find({});
      return jobs;
    } catch (error) {
      logger.error('Error getting jobs status:', error);
      throw error;
    }
  }

  // Tambahkan method untuk mendapatkan status job tertentu
  async getJobStatus(jobId) {
    try {
      const job = await JobStatus.findOne({ jobId });
      return job;
    } catch (error) {
      logger.error(`Error getting job status for ${jobId}:`, error);
      throw error;
    }
  }
}

// Inisialisasi CronJobSuper
const cronSuper = new CronJobSuper({
  mongoUri: process.env.MONGO_URI,
  checkInterval: 60000,
  retryAttempts: 3,
  retryDelay: 5000
});

// KOMENTARI SEMUA ENDPOINT CRONJOB
// app.get('/api/jobs', async (req, res) => { ... });
// app.get('/api/jobs/:jobId', async (req, res) => { ... });
// app.post('/api/jobs', async (req, res) => { ... });

// Tambahkan fungsi untuk login admin
async function loginAdmin() {
  try {
    const response = await axios.post(`${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      email: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD
    }, {
      headers: {
        'apikey': process.env.SUPABASE_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.access_token;
  } catch (error) {
    logger.error('Admin login failed:', error);
    throw error;
  }
}

// Modifikasi endpoint cron untuk menggunakan login admin
app.post('/cron', async (req, res) => {
  try {
    // Verifikasi token cron-job.org
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET_TOKEN}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Login sebagai admin
    const adminToken = await loginAdmin();
    
    // Jalankan semua job yang terjadwal
    for (const [id, job] of cronSuper.jobs) {
      if (job.nextRun <= new Date()) {
        // Tambahkan token admin ke konteks job
        job.context = { adminToken };
        await cronSuper.executeJob(job);
      }
    }

    res.json({ status: 'success', message: 'Cron jobs executed successfully' });
  } catch (error) {
    logger.error('Cron endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint sederhana untuk cron-job.org
app.post('/api/trigger-cron', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Verifikasi kredensial
    if (username !== 'magangbpskotamojokerto@gmail.com' || password !== 'bpskotamojokerto') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Jalankan tugas yang diperlukan
    const tasks = [
      // Contoh tugas yang bisa dijalankan
      async () => {
        // Backup data
        logger.info('Running backup task...');
        // Implementasi backup
      },
      async () => {
        // Update status
        logger.info('Updating status...');
        // Implementasi update status
      }
    ];

    // Jalankan semua tugas
    for (const task of tasks) {
      try {
        await task();
      } catch (error) {
        logger.error('Task error:', error);
      }
    }

    res.json({ 
      status: 'success', 
      message: 'Cron tasks executed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Cron endpoint error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Contoh job
const exampleJob = {
  id: 'backup-database',
  schedule: '0 0 * * *', // Setiap hari jam 00:00
  task: async () => {
    // Implementasi backup database
    const backupPath = path.join(__dirname, 'backups', `backup-${Date.now()}.sql`);
    // ... kode backup database ...
  },
  retryOnFail: true,
  notifyOnFail: true,
  maxRetries: 3,
  timeout: 3600000, // 1 jam
  githubRepo: 'ekgb-bps-mojokerto',
  supabaseTable: 'job_backups'
};

// Inisialisasi dan jalankan
cronSuper.initialize()
  .then(() => cronSuper.addJob(exampleJob))
  .then(() => {
    // Jalankan server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch(error => logger.error('Failed to initialize:', error));

// Handle process termination
process.on('SIGTERM', async () => {
  await cronSuper.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await cronSuper.stop();
  process.exit(0);
}); 