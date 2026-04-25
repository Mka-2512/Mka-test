import { useRef, useEffect } from 'react';
import { formatRelDate } from '../utils/dateUtils.js';

export default function NotifDropdown({ notifs, onMarkRead, onMarkAllRead, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div ref={ref} style={{
      position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 340,
      background: 'white', border: '1px solid #e7e5e4', borderRadius: 12,
      boxShadow: '0 16px 48px rgba(0,0,0,0.13)', zIndex: 500,
      overflow: 'hidden', animation: 'slideDown .18s cubic-bezier(.22,1,.36,1)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', borderBottom: '1px solid #f5f5f4',
      }}>
        <span style={{ fontSize: 14, fontWeight: 700 }}>Notifications</span>
        {notifs.some(n => !n.read) && (
          <button onClick={onMarkAllRead} style={{
            fontSize: 12, color: '#2563eb', background: 'none', border: 'none',
            cursor: 'pointer', fontWeight: 600, padding: '3px 7px',
            borderRadius: 5, transition: 'background .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >Tout marquer comme lu</button>
        )}
      </div>
      <div style={{ maxHeight: 380, overflowY: 'auto' }}>
        {notifs.length === 0 ? (
          <div style={{ padding: '36px 16px', textAlign: 'center', color: '#a8a29e', fontSize: 13 }}>
            Aucune notification
          </div>
        ) : notifs.map(n => (
          <div
            key={n.id}
            onClick={() => onMarkRead(n.id)}
            style={{
              padding: '12px 16px', borderBottom: '1px solid #fafaf9',
              cursor: 'pointer', background: n.read ? 'white' : '#fafaf9',
              display: 'flex', gap: 12, alignItems: 'flex-start',
              transition: 'background .12s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f5f5f4'}
            onMouseLeave={e => e.currentTarget.style.background = n.read ? 'white' : '#fafaf9'}
          >
            <div style={{
              width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
              background: n.read ? 'transparent' : '#2563eb',
              border: n.read ? '1.5px solid #e7e5e4' : 'none',
              marginTop: 5,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: '#1c1917', lineHeight: 1.45, fontWeight: n.read ? 400 : 500 }}>
                {n.msg}
              </div>
              <div style={{ fontSize: 11, color: '#a8a29e', marginTop: 3 }}>{formatRelDate(n.date)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
