import { useState } from 'react';
import { LEAVE_TYPES } from '../data/initialData.js';
import { countWorkingDays, formatPeriod } from '../utils/dateUtils.js';

const TODAY = '2026-04-25';

export default function LeaveModal({ user, employees, onClose, onSubmit }) {
  const [type, setType]   = useState('CP');
  const [start, setStart] = useState('');
  const [end, setEnd]     = useState('');
  const [error, setError] = useState('');

  const emp  = employees.find(e => e.id === user.id);
  const days = start && end && end >= start ? countWorkingDays(start, end) : 0;

  function getBalance(t) {
    if (!emp) return 0;
    if (t === 'CP')  return emp.cp;
    if (t === 'RTT') return emp.rtt;
    return Infinity;
  }

  function handleSubmit() {
    if (!start || !end)       { setError('Veuillez saisir les dates de début et de fin.'); return; }
    if (end < start)          { setError('La date de fin doit être après la date de début.'); return; }
    if (days === 0)            { setError('Aucun jour ouvré dans la période sélectionnée.'); return; }
    const bal = getBalance(type);
    if (bal !== Infinity && days > bal) {
      setError(`Solde insuffisant — il vous reste ${bal}j de ${type}.`);
      return;
    }
    onSubmit({ type, start, end, days });
  }

  const IS = {
    width: '100%', padding: '9px 12px', border: '1px solid #d6d3d1',
    borderRadius: 6, fontSize: 14, outline: 'none', fontFamily: 'inherit',
    color: '#1c1917', background: 'white', transition: 'border-color .15s, box-shadow .15s',
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 16, animation: 'fadeIn .15s ease',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'white', borderRadius: 14, padding: 28,
        width: '100%', maxWidth: 460,
        boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
        animation: 'scaleIn .22s cubic-bezier(.22,1,.36,1)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>Nouvelle demande</h2>
            <p style={{ fontSize: 13, color: '#78716c', marginTop: 2 }}>
              {user.name}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, border: 'none', background: '#f5f5f4',
            borderRadius: 8, cursor: 'pointer', fontSize: 18, color: '#78716c',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#e7e5e4'}
          onMouseLeave={e => e.currentTarget.style.background = '#f5f5f4'}
          >×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Type selector — visual cards */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#78716c', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>
              Type de congé
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {Object.entries(LEAVE_TYPES).map(([k, v]) => {
                const bal = getBalance(k);
                const selected = type === k;
                return (
                  <button
                    key={k}
                    onClick={() => { setType(k); setError(''); }}
                    style={{
                      padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                      border: selected ? `2px solid ${v.color}` : '1.5px solid #e7e5e4',
                      background: selected ? v.bg : 'white',
                      textAlign: 'left', transition: 'all .15s',
                    }}
                    onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = v.color + '88'; }}
                    onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = '#e7e5e4'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: selected ? v.color : '#1c1917' }}>{v.label}</span>
                      {selected && <span style={{ fontSize: 14, color: v.color }}>✓</span>}
                    </div>
                    {bal !== Infinity && (
                      <div style={{ fontSize: 11, color: selected ? v.color : '#a8a29e', marginTop: 2, fontWeight: 500 }}>
                        {bal}j restants
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Début</label>
              <input type="date" value={start} min={TODAY}
                onChange={e => { setStart(e.target.value); setError(''); }}
                style={IS}
                onFocus={e => { e.target.style.borderColor = '#93c5fd'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#d6d3d1'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Fin</label>
              <input type="date" value={end} min={start || TODAY}
                onChange={e => { setEnd(e.target.value); setError(''); }}
                style={IS}
                onFocus={e => { e.target.style.borderColor = '#93c5fd'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#d6d3d1'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          {/* Live preview */}
          {days > 0 && !error && (
            <div style={{
              background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8,
              padding: '11px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              animation: 'slideUp .18s ease',
            }}>
              <div>
                <span style={{ color: '#15803d', fontSize: 15, fontWeight: 700 }}>
                  {days} jour{days > 1 ? 's' : ''} ouvré{days > 1 ? 's' : ''}
                </span>
                <div style={{ fontSize: 12, color: '#16a34a', marginTop: 1 }}>{formatPeriod(start, end)}</div>
              </div>
              {(type === 'CP' || type === 'RTT') && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#78716c' }}>Solde après</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: Math.max(0, getBalance(type) - days) <= 3 ? '#d97706' : '#15803d' }}>
                    {Math.max(0, getBalance(type) - days)}j
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 8, padding: '11px 16px', color: '#dc2626',
              fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
              animation: 'slideUp .18s ease',
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4, borderTop: '1px solid #f5f5f4' }}>
            <button onClick={onClose} className="btn btn-ghost">Annuler</button>
            <button onClick={handleSubmit} className="btn btn-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Soumettre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
