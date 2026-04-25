import { useState } from 'react';
import BalanceCard from '../components/BalanceCard.jsx';
import { TypeBadge, StatusBadge, SectionHeader, EmptyRow } from '../components/ui.jsx';
import { formatPeriod, formatDate } from '../utils/dateUtils.js';

export default function EmployeeDashboard({ user, employees, requests, onOpenModal }) {
  const [filter, setFilter] = useState('Tous');
  const emp = employees.find(e => e.id === user.id) || user;
  const malDays = requests.filter(r => r.eId === user.id && r.type === 'Maladie' && r.status === 'Approuvé').reduce((s, r) => s + r.days, 0);
  const ssDays  = requests.filter(r => r.eId === user.id && r.type === 'Sans solde' && r.status === 'Approuvé').reduce((s, r) => s + r.days, 0);

  const allReqs = requests.filter(r => r.eId === user.id).sort((a, b) => b.id - a.id);
  const filtered = filter === 'Tous' ? allReqs : allReqs.filter(r => r.status === filter);

  const stats = {
    pending:  allReqs.filter(r => r.status === 'En attente').length,
    approved: allReqs.filter(r => r.status === 'Approuvé').length,
    refused:  allReqs.filter(r => r.status === 'Refusé').length,
  };

  return (
    <div>
      {/* Balance cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 14, marginBottom: 28 }}>
        <BalanceCard type="CP"          remaining={emp.cp}  total={25}   index={0} />
        <BalanceCard type="RTT"         remaining={emp.rtt} total={10}   index={1} />
        <BalanceCard type="Maladie"     remaining={null}    total={null} daysTaken={malDays} index={2} />
        <BalanceCard type="Sans solde"  remaining={null}    total={null} daysTaken={ssDays}  index={3} />
      </div>

      {/* Actions row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <button onClick={onOpenModal} className="btn btn-primary" style={{ gap: 8 }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
          Nouvelle demande
        </button>

        {/* Quick stats */}
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          {[
            { label: 'En attente', val: stats.pending,  color: '#d97706', bg: '#fffbeb' },
            { label: 'Approuvées', val: stats.approved, color: '#16a34a', bg: '#f0fdf4' },
            { label: 'Refusées',   val: stats.refused,  color: '#dc2626', bg: '#fef2f2' },
          ].map(s => (
            <div key={s.label} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', background: s.bg, borderRadius: 20,
              border: `1px solid ${s.color}22`,
            }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.val}</span>
              <span style={{ fontSize: 11, color: s.color, fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* History table */}
      <SectionHeader
        title="Historique des demandes"
        action={
          <div style={{ display: 'flex', gap: 6 }}>
            {['Tous', 'En attente', 'Approuvé', 'Refusé'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '4px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600,
                  background: filter === f ? '#1c1917' : '#f5f5f4',
                  color: filter === f ? 'white' : '#78716c',
                  transition: 'all .15s',
                }}
              >{f}</button>
            ))}
          </div>
        }
      />

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                {['Type', 'Période', 'Jours ouvrés', 'Statut', 'Soumis le', 'Motif'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <EmptyRow cols={6} message="Aucune demande pour le moment" />
                : filtered.map(r => (
                  <tr key={r.id}>
                    <td><TypeBadge type={r.type} /></td>
                    <td style={{ color: '#374151', whiteSpace: 'nowrap' }}>{formatPeriod(r.start, r.end)}</td>
                    <td style={{ color: '#374151' }}>{r.days}j</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td style={{ color: '#78716c', whiteSpace: 'nowrap' }}>{formatDate(r.submitted)}</td>
                    <td style={{ fontSize: 13, color: '#dc2626', maxWidth: 220 }}>
                      {r.reason || <span style={{ color: '#d6d3d1' }}>—</span>}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
