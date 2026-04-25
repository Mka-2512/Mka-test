import { useState } from 'react';
import { Avatar, TypeBadge, SectionHeader } from '../components/ui.jsx';
import { formatDate, formatPeriod } from '../utils/dateUtils.js';

function PendingCard({ req, emp, onApprove, onRefuse }) {
  const [refusing, setRefusing]     = useState(false);
  const [reason, setReason]         = useState('');
  const [reasonError, setReasonError] = useState(false);
  const [leaving, setLeaving]       = useState(false);

  function handleApprove() {
    setLeaving(true);
    setTimeout(() => onApprove(req.id), 300);
  }

  function handleConfirmRefuse() {
    if (!reason.trim()) { setReasonError(true); return; }
    setLeaving(true);
    setTimeout(() => onRefuse(req.id, reason.trim()), 300);
  }

  return (
    <div className="card" style={{
      padding: '18px 20px',
      transition: 'all .3s ease',
      opacity: leaving ? 0 : 1,
      transform: leaving ? 'scale(.97) translateY(4px)' : 'scale(1)',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {emp && <Avatar name={emp.name} size={38} />}
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1c1917' }}>{emp ? emp.name : '—'}</div>
            <div style={{ fontSize: 12, color: '#78716c', marginTop: 2 }}>
              Soumis le {formatDate(req.submitted)}
            </div>
          </div>
        </div>
        <TypeBadge type={req.type} />
      </div>

      {/* Info grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16, background: '#fafaf9', borderRadius: 8, padding: 12 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>Période</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{formatPeriod(req.start, req.end)}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>Durée</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{req.days} j. ouvré{req.days > 1 ? 's' : ''}</div>
        </div>
        {emp && (req.type === 'CP' || req.type === 'RTT') && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>Solde actuel</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: req.type === 'CP' && emp.cp <= req.days ? '#dc2626' : '#374151' }}>
              {req.type === 'CP' ? `${emp.cp}/25j CP` : `${emp.rtt}/10j RTT`}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {!refusing ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleApprove} className="btn btn-green" style={{ flex: 1, justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Approuver
          </button>
          <button onClick={() => setRefusing(true)} className="btn btn-red-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Refuser
          </button>
        </div>
      ) : (
        <div style={{ borderTop: '1px solid #f5f5f4', paddingTop: 14, animation: 'slideUp .18s ease' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
            Motif du refus <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <textarea
            value={reason}
            onChange={e => { setReason(e.target.value); setReasonError(false); }}
            placeholder="Expliquez la raison du refus…"
            style={{
              width: '100%', padding: '9px 12px',
              border: `1px solid ${reasonError ? '#fca5a5' : '#d6d3d1'}`,
              borderRadius: 6, fontSize: 13, fontFamily: 'inherit',
              resize: 'vertical', minHeight: 76, outline: 'none', color: '#1c1917',
              transition: 'border-color .15s',
            }}
            onFocus={e => e.target.style.borderColor = reasonError ? '#ef4444' : '#93c5fd'}
            onBlur={e => e.target.style.borderColor = reasonError ? '#fca5a5' : '#d6d3d1'}
          />
          {reasonError && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>Le motif est obligatoire.</p>}
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button onClick={() => { setRefusing(false); setReason(''); setReasonError(false); }} className="btn btn-ghost btn-sm">
              Annuler
            </button>
            <button onClick={handleConfirmRefuse} className="btn btn-red btn-sm">
              Confirmer le refus
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PendingRequestsView({ requests, employees, onApprove, onRefuse }) {
  const pending = requests.filter(r => r.status === 'En attente').sort((a, b) => b.id - a.id);

  return (
    <div>
      <SectionHeader
        title="Demandes en attente"
        action={<span style={{ fontSize: 13, color: '#78716c' }}>{pending.length} demande{pending.length !== 1 ? 's' : ''}</span>}
      />
      {pending.length === 0 ? (
        <div className="card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1c1917', marginBottom: 6 }}>Tout est à jour !</div>
          <div style={{ fontSize: 13, color: '#a8a29e' }}>Aucune demande en attente de traitement.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 14 }}>
          {pending.map((req, i) => (
            <div key={req.id} className="anim-in" style={{ animationDelay: `${i * 50}ms` }}>
              <PendingCard
                req={req}
                emp={employees.find(e => e.id === req.eId)}
                onApprove={onApprove}
                onRefuse={onRefuse}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
