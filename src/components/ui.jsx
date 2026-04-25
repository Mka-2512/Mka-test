import { useEffect } from 'react';
import { LEAVE_TYPES, STATUS_META } from '../data/initialData.js';

export function Avatar({ name, size = 30 }) {
  const parts = name.trim().split(' ');
  const initials = (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 300 + 30;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `oklch(0.82 0.07 ${hue})`, color: `oklch(0.25 0.06 ${hue})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.round(size * 0.36), fontWeight: 700, userSelect: 'none',
    }}>{initials}</div>
  );
}

export function TypeBadge({ type }) {
  const meta = LEAVE_TYPES[type] || { label: type, color: '#78716c', bg: '#f5f5f4' };
  return (
    <span className="badge" style={{
      background: meta.bg, color: meta.color,
      border: `1px solid ${meta.color}33`,
    }}>{meta.label}</span>
  );
}

export function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { color: '#78716c', bg: '#f5f5f4' };
  return (
    <span className="badge" style={{
      background: meta.bg, color: meta.color,
      border: `1px solid ${meta.color}33`,
    }}>{status}</span>
  );
}

export function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: '#1c1917', color: 'white', borderRadius: 10,
      padding: '13px 20px', fontSize: 14, fontWeight: 500,
      boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
      display: 'flex', flexDirection: 'column', gap: 8, minWidth: 240,
      animation: 'slideUp .25s cubic-bezier(.22,1,.36,1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 16 }}>✓</span>
        <span>{message}</span>
      </div>
      <div style={{ height: 2, background: 'rgba(255,255,255,0.15)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', background: 'rgba(255,255,255,0.5)', borderRadius: 2,
          animation: 'toastProgress 3.5s linear forwards',
        }} />
      </div>
    </div>
  );
}

export function EmptyRow({ cols, message }) {
  return (
    <tr>
      <td colSpan={cols}>
        <div className="empty">{message || 'Aucune donnée'}</div>
      </td>
    </tr>
  );
}

export function SectionHeader({ title, action }) {
  return (
    <div className="section-hd">
      <h2>{title}</h2>
      {action}
    </div>
  );
}
