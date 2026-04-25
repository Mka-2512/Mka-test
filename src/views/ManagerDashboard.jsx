import { useState } from 'react';
import { Avatar, TypeBadge, StatusBadge, SectionHeader, EmptyRow } from '../components/ui.jsx';
import { formatPeriod, formatDate } from '../utils/dateUtils.js';

export default function ManagerDashboard({ employees, requests }) {
  const [search, setSearch]     = useState('');
  const [typeFilter, setTypeFilter]   = useState('Tous');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [sortKey, setSortKey]   = useState('id');
  const [sortDir, setSortDir]   = useState('desc');

  const pendingCount = requests.filter(r => r.status === 'En attente').length;
  const approvedCount = requests.filter(r => r.status === 'Approuvé').length;
  const totalDays = requests.filter(r => r.status === 'Approuvé').reduce((s, r) => s + r.days, 0);

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  const filtered = requests
    .filter(r => {
      const emp = employees.find(e => e.id === r.eId);
      const name = emp ? emp.name.toLowerCase() : '';
      if (search && !name.includes(search.toLowerCase())) return false;
      if (typeFilter !== 'Tous' && r.type !== typeFilter) return false;
      if (statusFilter !== 'Tous' && r.status !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (sortKey === 'name') {
        av = (employees.find(e => e.id === a.eId) || {}).name || '';
        bv = (employees.find(e => e.id === b.eId) || {}).name || '';
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ?  1 : -1;
      return 0;
    });

  function SortIcon({ col }) {
    if (sortKey !== col) return <span style={{ opacity: .3 }}>↕</span>;
    return <span style={{ color: '#1c1917' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  const TH = ({ col, children }) => (
    <th onClick={() => toggleSort(col)} style={{ cursor: 'pointer', userSelect: 'none' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {children} <SortIcon col={col} />
      </span>
    </th>
  );

  return (
    <div>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'En attente',    val: pendingCount,  color: '#d97706', bg: '#fffbeb', icon: '⏳' },
          { label: 'Approuvées',    val: approvedCount, color: '#16a34a', bg: '#f0fdf4', icon: '✅' },
          { label: 'Jours approuvés', val: totalDays,   color: '#2563eb', bg: '#eff6ff', icon: '📅' },
        ].map((k, i) => (
          <div key={k.label} className="card anim-in" style={{
            padding: '18px 20px', borderLeft: `4px solid ${k.color}`,
            animationDelay: `${i * 60}ms`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#78716c', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>
              {k.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#1c1917', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 10 }}>
              {k.val}
              <span style={{ fontSize: 20 }}>{k.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Team balances */}
      <SectionHeader
        title="Soldes de l'équipe"
        action={<span style={{ fontSize: 13, color: '#78716c' }}>{employees.length} employés</span>}
      />
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Employé</th>
                <th>CP restants</th>
                <th>RTT restants</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => (
                <tr key={emp.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={emp.name} size={28} />
                      <span style={{ fontWeight: 500 }}>{emp.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: emp.cp <= 5 ? '#dc2626' : '#1c1917', minWidth: 28 }}>{emp.cp}</span>
                      <span style={{ fontSize: 12, color: '#a8a29e' }}>/25j</span>
                      <div style={{ flex: 1, height: 5, background: '#f5f5f4', borderRadius: 3, overflow: 'hidden', maxWidth: 100 }}>
                        <div style={{ height: '100%', width: (emp.cp / 25 * 100) + '%', background: '#2563eb', borderRadius: 3, animation: 'barFill .7s ease' }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: emp.rtt <= 2 ? '#dc2626' : '#1c1917', minWidth: 28 }}>{emp.rtt}</span>
                      <span style={{ fontSize: 12, color: '#a8a29e' }}>/10j</span>
                      <div style={{ flex: 1, height: 5, background: '#f5f5f4', borderRadius: 3, overflow: 'hidden', maxWidth: 70 }}>
                        <div style={{ height: '100%', width: (emp.rtt / 10 * 100) + '%', background: '#7c3aed', borderRadius: 3, animation: 'barFill .7s ease' }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All requests with filters */}
      <SectionHeader
        title="Toutes les demandes"
        action={pendingCount > 0 && (
          <span style={{ fontSize: 13, color: '#d97706', fontWeight: 600 }}>
            {pendingCount} en attente
          </span>
        )}
      />

      {/* Filters row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="input"
            placeholder="Rechercher un employé…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="input" style={{ width: 'auto' }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="Tous">Tous types</option>
          <option value="CP">Congés Payés</option>
          <option value="RTT">RTT</option>
          <option value="Maladie">Maladie</option>
          <option value="Sans solde">Sans solde</option>
        </select>
        <select className="input" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="Tous">Tous statuts</option>
          <option value="En attente">En attente</option>
          <option value="Approuvé">Approuvé</option>
          <option value="Refusé">Refusé</option>
        </select>
        {(search || typeFilter !== 'Tous' || statusFilter !== 'Tous') && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setTypeFilter('Tous'); setStatusFilter('Tous'); }}>
            Réinitialiser
          </button>
        )}
        <span style={{ fontSize: 12, color: '#a8a29e', marginLeft: 'auto' }}>{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <TH col="name">Employé</TH>
                <TH col="type">Type</TH>
                <TH col="start">Période</TH>
                <TH col="days">Jours</TH>
                <TH col="status">Statut</TH>
                <TH col="submitted">Soumis le</TH>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <EmptyRow cols={6} message="Aucune demande ne correspond aux filtres" />
                : filtered.map(r => {
                  const emp = employees.find(e => e.id === r.eId);
                  return (
                    <tr key={r.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {emp && <Avatar name={emp.name} size={24} />}
                          <span>{emp ? emp.name : '—'}</span>
                        </div>
                      </td>
                      <td><TypeBadge type={r.type} /></td>
                      <td style={{ whiteSpace: 'nowrap' }}>{formatPeriod(r.start, r.end)}</td>
                      <td>{r.days}j</td>
                      <td><StatusBadge status={r.status} /></td>
                      <td style={{ color: '#78716c', whiteSpace: 'nowrap' }}>{formatDate(r.submitted)}</td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
