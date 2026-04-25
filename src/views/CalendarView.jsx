import { useState } from 'react';
import { Avatar } from '../components/ui.jsx';
import { LEAVE_TYPES } from '../data/initialData.js';
import { toDateStr, isWeekend } from '../utils/dateUtils.js';

const TODAY = '2026-04-25';
const DAY_ABBR = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

function Tooltip({ children, content }) {
  const [show, setShow] = useState(false);
  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && content && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
          transform: 'translateX(-50%)',
          background: '#1c1917', color: 'white',
          borderRadius: 6, padding: '5px 10px',
          fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap',
          pointerEvents: 'none', zIndex: 50,
          boxShadow: '0 4px 12px rgba(0,0,0,.2)',
          animation: 'fadeIn .1s ease',
        }}>
          {content}
          <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #1c1917' }} />
        </div>
      )}
    </div>
  );
}

export default function CalendarView({ user, requests, employees }) {
  const [year, setYear]       = useState(2026);
  const [month, setMonth]     = useState(3);
  const [viewMode, setViewMode] = useState(user.role === 'manager' ? 'manager' : 'employee');
  const isManager = user.role === 'manager';

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const monthLabel = new Date(year, month, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  function getAbsences(eId, day) {
    const ds = toDateStr(year, month, day);
    return requests.filter(r => r.eId === eId && r.status === 'Approuvé' && ds >= r.start && ds <= r.end);
  }

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={prevMonth} className="btn-icon">‹</button>
          <span style={{ fontSize: 15, fontWeight: 700, minWidth: 170, textAlign: 'center', textTransform: 'capitalize' }}>
            {monthLabel}
          </span>
          <button onClick={nextMonth} className="btn-icon">›</button>
        </div>

        <button
          onClick={() => { setMonth(3); setYear(2026); }}
          className="btn btn-ghost btn-sm"
          style={{ fontSize: 12 }}
        >
          Aujourd'hui
        </button>

        {isManager && (
          <div className="seg-ctrl" style={{ marginLeft: 'auto' }}>
            <button className={`seg-btn${viewMode === 'manager' ? ' active' : ''}`} onClick={() => setViewMode('manager')}>Vue manager</button>
            <button className={`seg-btn${viewMode === 'employee' ? ' active' : ''}`} onClick={() => setViewMode('employee')}>Vue employé</button>
          </div>
        )}
      </div>

      {/* Calendar grid */}
      <div className="card">
        <div className="table-wrap">
          <table style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: 150, minWidth: 150 }} />
              {days.map(d => <col key={d} style={{ width: 34, minWidth: 30 }} />)}
            </colgroup>
            <thead>
              <tr style={{ background: '#fafaf9', borderBottom: '1px solid #e7e5e4' }}>
                <th style={{
                  padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700,
                  color: '#78716c', textTransform: 'uppercase', letterSpacing: '.05em',
                  position: 'sticky', left: 0, background: '#fafaf9', zIndex: 2,
                  borderRight: '1px solid #e7e5e4',
                }}>Employé</th>
                {days.map(d => {
                  const we = isWeekend(year, month, d);
                  const isToday = toDateStr(year, month, d) === TODAY;
                  const dow = new Date(year, month, d).getDay();
                  return (
                    <th key={d} style={{
                      padding: '6px 2px', textAlign: 'center', fontSize: 11,
                      background: isToday ? '#fefce8' : we ? '#f9f9f8' : '#fafaf9',
                      borderLeft: '1px solid #f0eeee',
                    }}>
                      <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: we ? '#d1cdc9' : '#a8a29e' }}>
                        {DAY_ABBR[dow]}
                      </div>
                      <div style={{
                        fontSize: 12, marginTop: 2, fontWeight: isToday ? 800 : 500,
                        color: isToday ? '#d97706' : we ? '#c4bfbb' : '#57534e',
                        background: isToday ? '#fde68a' : 'transparent',
                        width: isToday ? 20 : 'auto', height: isToday ? 20 : 'auto',
                        borderRadius: isToday ? '50%' : 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: isToday ? '2px auto 0' : '2px 0 0',
                      }}>{d}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, ei) => (
                <tr key={emp.id} style={{ borderBottom: ei < employees.length - 1 ? '1px solid #f5f5f4' : 'none' }}>
                  <td style={{
                    padding: '8px 14px', position: 'sticky', left: 0,
                    background: 'white', zIndex: 1, borderRight: '1px solid #f0eeee',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={emp.name} size={22} />
                      <span style={{
                        fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
                        color: user.role === 'employee' && emp.id === user.id ? '#2563eb' : '#1c1917',
                      }}>{emp.name}</span>
                    </div>
                  </td>
                  {days.map(d => {
                    const absences = getAbsences(emp.id, d);
                    const we = isWeekend(year, month, d);
                    const isToday = toDateStr(year, month, d) === TODAY;
                    return (
                      <td key={d} style={{
                        minWidth: 30, padding: '6px 2px', textAlign: 'center',
                        background: isToday ? '#fefce8' : we ? '#f9f9f8' : 'white',
                        borderLeft: '1px solid #f0eeee',
                      }}>
                        {absences.length > 0 && !we && (
                          viewMode === 'manager'
                            ? absences.map(a => (
                              <Tooltip
                                key={a.id}
                                content={`${LEAVE_TYPES[a.type].label}`}
                              >
                                <span style={{
                                  display: 'inline-block', width: 9, height: 9,
                                  borderRadius: '50%', background: LEAVE_TYPES[a.type].color,
                                  margin: '0 1px', cursor: 'default',
                                }} />
                              </Tooltip>
                            ))
                            : (
                              <Tooltip content={`${emp.name} – Absent`}>
                                <span style={{
                                  display: 'inline-block', width: 9, height: 9,
                                  borderRadius: '50%', background: '#c4b5fd', cursor: 'default',
                                }} />
                              </Tooltip>
                            )
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 12, alignItems: 'center' }}>
        {viewMode === 'manager'
          ? Object.entries(LEAVE_TYPES).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: v.color }} />
              <span style={{ fontSize: 12, color: '#57534e' }}>{v.label}</span>
            </div>
          ))
          : <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#c4b5fd' }} />
            <span style={{ fontSize: 12, color: '#57534e' }}>Absent</span>
          </div>
        }
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 14, height: 10, borderRadius: 3, background: '#fde68a', border: '1px solid #fbbf24' }} />
          <span style={{ fontSize: 12, color: '#57534e' }}>Aujourd'hui</span>
        </div>
      </div>
    </div>
  );
}
