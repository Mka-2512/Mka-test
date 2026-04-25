import { useState } from 'react';
import { Avatar } from './ui.jsx';
import NotifDropdown from './NotifDropdown.jsx';

export default function Header({ user, notifs, onLogout, onMarkRead, onMarkAllRead }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = notifs.filter(n => !n.read).length;

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e7e5e4',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 24px', height: 56,
        maxWidth: 1280, margin: '0 auto',
      }}>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: '#1c1917', marginRight: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🏖</span>
          Congés
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={user.name} size={28} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{user.name}</span>
          {user.role === 'manager' && (
            <span style={{
              fontSize: 11, fontWeight: 700, color: '#7c3aed',
              background: '#f5f3ff', border: '1px solid #ddd6fe',
              padding: '2px 8px', borderRadius: 5,
            }}>Manager</span>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen(v => !v)}
            className="btn-icon"
            style={{ position: 'relative', background: notifOpen ? '#f5f5f4' : 'white', borderColor: notifOpen ? '#d6d3d1' : '#e7e5e4' }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unread > 0 && (
              <span style={{
                position: 'absolute', top: 7, right: 7,
                width: 8, height: 8, background: '#dc2626',
                borderRadius: '50%', border: '2px solid white',
                animation: 'badgePulse 2s ease infinite',
              }} />
            )}
          </button>
          {notifOpen && (
            <NotifDropdown
              notifs={notifs}
              onMarkRead={onMarkRead}
              onMarkAllRead={onMarkAllRead}
              onClose={() => setNotifOpen(false)}
            />
          )}
        </div>

        <button
          onClick={onLogout}
          className="btn btn-ghost btn-sm"
        >
          Changer de profil
        </button>
      </div>
    </header>
  );
}
