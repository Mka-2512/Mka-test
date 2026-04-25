import { useEffect, useRef, useState } from 'react';
import { LEAVE_TYPES } from '../data/initialData.js';

function useCountUp(target, duration = 600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target == null) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

export default function BalanceCard({ type, remaining, total, daysTaken = 0, index = 0 }) {
  const meta = LEAVE_TYPES[type];
  const isUnlimited = total === null;
  const pct = isUnlimited ? 0 : Math.max(0, Math.min(100, (remaining / total) * 100));
  const isLow = !isUnlimited && remaining <= 3 && remaining > 0;
  const isEmpty = !isUnlimited && remaining === 0;
  const displayVal = useCountUp(isUnlimited ? daysTaken : remaining, 700);

  return (
    <div className="card anim-in" style={{
      borderLeft: `4px solid ${meta.color}`,
      padding: '18px 20px',
      display: 'flex', flexDirection: 'column', gap: 12,
      animationDelay: `${index * 60}ms`,
      transition: 'box-shadow .2s ease, transform .2s ease',
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#78716c', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>
            {meta.label}
          </div>
          {isUnlimited ? (
            <div style={{ fontSize: 26, fontWeight: 800, color: '#1c1917', letterSpacing: '-0.02em' }}>
              {displayVal > 0 ? <>{displayVal}<span style={{ fontSize: 13, fontWeight: 400, color: '#78716c', marginLeft: 5 }}>j pris</span></> : <span style={{ fontSize: 18, color: '#a8a29e' }}>—</span>}
            </div>
          ) : (
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: isEmpty ? '#a8a29e' : isLow ? meta.color : '#1c1917' }}>
              {displayVal}
              <span style={{ fontSize: 14, fontWeight: 500, color: '#a8a29e', marginLeft: 3 }}>/{total}j</span>
            </div>
          )}
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: meta.bg, border: `1.5px solid ${meta.color}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: meta.color, animation: isLow ? 'badgePulse 1.5s ease infinite' : 'none' }} />
        </div>
      </div>

      {!isUnlimited && (
        <div>
          <div style={{ height: 5, background: '#f0eeee', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: pct + '%', background: isEmpty ? '#e7e5e4' : meta.color,
              borderRadius: 3, animation: 'barFill .8s cubic-bezier(.22,1,.36,1)',
              transition: 'width .4s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 11, color: '#a8a29e' }}>
            <span>{isLow && !isEmpty ? '⚠ Solde faible' : isEmpty ? 'Épuisé' : `${total - remaining}j utilisés`}</span>
            <span>{Math.round(pct)}%</span>
          </div>
        </div>
      )}
      {isUnlimited && <div style={{ fontSize: 12, color: '#a8a29e' }}>Illimité</div>}
    </div>
  );
}
