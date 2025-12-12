import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function HeartPulse() {
    const [isAlive, setIsAlive] = useState(null); // null = loading, true = alive, false = dead
    const [lastCheck, setLastCheck] = useState(null);

    const checkSupabaseHealth = async () => {
        try {
            // Ping Supabase dengan mengecek session
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                setIsAlive(false);
            } else {
                setIsAlive(true);
            }
            setLastCheck(new Date());
        } catch (err) {
            setIsAlive(false);
            setLastCheck(new Date());
        }
    };

    useEffect(() => {
        // Cek saat pertama kali mount
        checkSupabaseHealth();

        // Cek ulang setiap 30 detik
        const interval = setInterval(checkSupabaseHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = () => {
        if (isAlive === null) return '#888'; // Loading - gray
        return isAlive ? '#00ff00' : '#ff0000'; // Green or Red
    };

    const getStatusText = () => {
        if (isAlive === null) return 'Checking...';
        return isAlive ? 'Database Online' : 'Database Offline';
    };

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: '10px 15px',
                borderRadius: '25px',
                boxShadow: `0 0 10px ${getStatusColor()}40`,
                border: `1px solid ${getStatusColor()}60`,
                zIndex: 9999,
                cursor: 'pointer',
            }}
            onClick={checkSupabaseHealth}
            title={`Last check: ${lastCheck ? lastCheck.toLocaleTimeString() : 'Never'}\nClick to refresh`}
        >
            {/* Heart Icon with Pulse Animation */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={getStatusColor()}
                style={{
                    animation: isAlive ? 'heartbeat 1s infinite' : 'none',
                    filter: `drop-shadow(0 0 5px ${getStatusColor()})`,
                }}
            >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>

            <span
                style={{
                    color: getStatusColor(),
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textShadow: `0 0 5px ${getStatusColor()}`,
                }}
            >
                {getStatusText()}
            </span>

            {/* CSS Animation */}
            <style>
                {`
          @keyframes heartbeat {
            0% { transform: scale(1); }
            25% { transform: scale(1.1); }
            50% { transform: scale(1); }
            75% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}
            </style>
        </div>
    );
}

export default HeartPulse;
