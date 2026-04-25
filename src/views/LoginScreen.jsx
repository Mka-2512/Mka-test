import { useState } from 'react';
import { Avatar } from '../components/ui.jsx';
import { MANAGER, EMPLOYEES } from '../data/initialData.js';

export default function LoginScreen({ onLogin }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fafaf9 0%, #f5f3ff 50%, #eff6ff 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      {/* Logo */}
      <div className="anim-in" style={{ marginBottom: 40, textAlign: 'center', animationDelay: '0ms' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, margin: '0 auto 16px',
        }}>🏖</div>
        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em', color: '#1c1917' }}>Congés</h1>
        <p style={{ fontSize: 14, color: '#78716c', marginTop: 6 }}>
          Sélectionnez votre profil pour continuer
        </p>
      </div>

      <div className="anim-in" style={{ width: '100%', maxWidth: 660, animationDelay: '80ms' }}>
        {/* Manager */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#a8a29e', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 10 }}>
            Manager
          </div>
          <button
            onClick={() => onLogin(MANAGER)}
            onMouseEnter={() => setHoveredId('manager')}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              width: '100%', padding: '16px 20px',
              background: hoveredId === 'manager' ? '#292524' : '#1c1917',
              color: 'white', border: 'none', borderRadius: 10,
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 14,
              transition: 'all .2s ease',
              transform: hoveredId === 'manager' ? 'translateY(-1px)' : 'translateY(0)',
              boxShadow: hoveredId === 'manager' ? '0 8px 24px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <Avatar name={MANAGER.name} size={38} />
            <div style={{ textAlign: 'left' }}>
              <div>{MANAGER.name}</div>
              <div style={{ fontSize: 12, opacity: .6, fontWeight: 400, marginTop: 1 }}>Responsable RH</div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 11, opacity: .5, fontWeight: 400, background: 'rgba(255,255,255,.1)', padding: '3px 10px', borderRadius: 20 }}>
              Manager
            </span>
          </button>
        </div>

        {/* Employees */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#a8a29e', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 10 }}>
            Employés — {EMPLOYEES.length} personnes
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 8 }}>
            {EMPLOYEES.map((emp, i) => (
              <button
                key={emp.id}
                onClick={() => onLogin({ ...emp, role: 'employee' })}
                onMouseEnter={() => setHoveredId(emp.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  padding: '12px 14px',
                  background: hoveredId === emp.id ? 'white' : 'rgba(255,255,255,0.8)',
                  border: `1.5px solid ${hoveredId === emp.id ? '#c4b5fd' : '#e7e5e4'}`,
                  borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10, color: '#1c1917',
                  textAlign: 'left', transition: 'all .18s ease',
                  transform: hoveredId === emp.id ? 'translateY(-1px)' : 'translateY(0)',
                  boxShadow: hoveredId === emp.id ? '0 4px 14px rgba(0,0,0,0.08)' : 'none',
                  animation: `slideUp .22s ${i * 20}ms both`,
                }}
              >
                <Avatar name={emp.name} size={30} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{emp.name}</div>
                  <div style={{ fontSize: 11, color: '#a8a29e', marginTop: 1 }}>{emp.cp}j CP · {emp.rtt}j RTT</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
