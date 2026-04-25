export default function NavTabs({ user, activeTab, onTab, pendingCount, onExport }) {
  const tabs = user.role === 'manager'
    ? [
        { id: 'dashboard', label: 'Tableau de bord' },
        { id: 'calendar',  label: 'Calendrier' },
        { id: 'pending',   label: 'Demandes en attente', badge: pendingCount },
      ]
    : [
        { id: 'dashboard', label: 'Tableau de bord' },
        { id: 'calendar',  label: 'Calendrier' },
      ];

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #e7e5e4' }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '0 24px', maxWidth: 1280, margin: '0 auto', gap: 2,
      }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => onTab(t.id)}
            style={{
              padding: '0 16px', height: 44,
              display: 'flex', alignItems: 'center', gap: 8,
              border: 'none', background: 'none',
              fontSize: 14, fontWeight: activeTab === t.id ? 700 : 500,
              cursor: 'pointer',
              color: activeTab === t.id ? '#1c1917' : '#78716c',
              borderBottom: `2px solid ${activeTab === t.id ? '#1c1917' : 'transparent'}`,
              marginBottom: -1,
              transition: 'color .15s, border-color .15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { if (activeTab !== t.id) e.currentTarget.style.color = '#374151'; }}
            onMouseLeave={e => { if (activeTab !== t.id) e.currentTarget.style.color = '#78716c'; }}
          >
            {t.label}
            {t.badge > 0 && (
              <span style={{
                background: '#d97706', color: 'white',
                borderRadius: 10, fontSize: 11, fontWeight: 700,
                padding: '1px 7px', lineHeight: 1.5,
                animation: 'badgePulse 2.5s ease infinite',
              }}>{t.badge}</span>
            )}
          </button>
        ))}

        {user.role === 'manager' && (
          <div style={{ marginLeft: 'auto' }}>
            <button onClick={onExport} className="btn btn-ghost btn-sm" style={{ gap: 6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Exporter CSV
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
