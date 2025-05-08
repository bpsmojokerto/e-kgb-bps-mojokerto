import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <div className="bg-light border-end" style={{width: 250, minHeight: '100vh', position: 'relative'}}>
    <div className="p-3">
      <h5>Menu</h5>
      <ul className="list-unstyled">
        <li><Link to="/">Dashboard</Link></li>
        <li>BERKALA
          <ul>
            <li>Data ASN
              <ul>
                <li><Link to="/data-asn">Daftar PNS</Link></li>
              </ul>
            </li>
            <li>Data Berkala
              <ul>
                <li><Link to="/data-berkala-pns">Data Berkala PNS</Link></li>
              </ul>
            </li>
            <li>Tabel Gaji
              <ul>
                <li><Link to="/tabel-gaji-pns">Tabel Gaji PNS</Link></li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div style={{position: 'absolute', bottom: 20, left: 0, width: '100%', textAlign: 'center', color: '#888', fontSize: 14}}>
      Created by : OUR TEAM
    </div>
  </div>
);

export default Sidebar;