import { useState } from 'react';
import { MANAGER, EMPLOYEES, INITIAL_REQUESTS, INITIAL_NOTIFICATIONS, LEAVE_TYPES, TODAY } from './data/initialData.js';
import { formatPeriod } from './utils/dateUtils.js';
import Header from './components/Header.jsx';
import NavTabs from './components/NavTabs.jsx';
import LeaveModal from './components/LeaveModal.jsx';
import { Toast } from './components/ui.jsx';
import LoginScreen from './views/LoginScreen.jsx';
import EmployeeDashboard from './views/EmployeeDashboard.jsx';
import ManagerDashboard from './views/ManagerDashboard.jsx';
import PendingRequestsView from './views/PendingRequestsView.jsx';
import CalendarView from './views/CalendarView.jsx';

export default function App() {
  const [currentUser,   setCurrentUser]   = useState(null);
  const [activeTab,     setActiveTab]     = useState('dashboard');
  const [employees,     setEmployees]     = useState(() => EMPLOYEES.map(e => ({ ...e })));
  const [requests,      setRequests]      = useState(() => INITIAL_REQUESTS.map(r => ({ ...r })));
  const [notifications, setNotifications] = useState(() => INITIAL_NOTIFICATIONS.map(n => ({ ...n })));
  const [modalOpen,     setModalOpen]     = useState(false);
  const [nextId,        setNextId]        = useState(200);
  const [toast,         setToast]         = useState(null);

  function showToast(msg) {
    setToast(null);
    setTimeout(() => setToast(msg), 10);
  }

  function login(user) {
    setCurrentUser(user);
    setActiveTab('dashboard');
  }

  function logout() {
    setCurrentUser(null);
    setActiveTab('dashboard');
    setModalOpen(false);
  }

  function submitRequest({ type, start, end, days }) {
    const id = nextId;
    const newReq = {
      id, eId: currentUser.id, type, start, end, days,
      status: 'En attente', reason: null, submitted: TODAY,
    };
    setRequests(prev => [newReq, ...prev]);
    setNotifications(prev => [{
      id: id + 1, rId: 0,
      msg: `${currentUser.name} a soumis une demande de ${LEAVE_TYPES[type].label} (${days}j, ${formatPeriod(start, end)})`,
      date: TODAY, read: false,
    }, ...prev]);
    setNextId(n => n + 2);
    setModalOpen(false);
    showToast('Demande soumise avec succès');
  }

  function approveRequest(reqId) {
    const req = requests.find(r => r.id === reqId);
    if (!req) return;
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Approuvé' } : r));
    if (req.type === 'CP')  setEmployees(prev => prev.map(e => e.id === req.eId ? { ...e, cp:  Math.max(0, e.cp  - req.days) } : e));
    if (req.type === 'RTT') setEmployees(prev => prev.map(e => e.id === req.eId ? { ...e, rtt: Math.max(0, e.rtt - req.days) } : e));
    const id = nextId;
    setNotifications(prev => [{
      id, rId: req.eId,
      msg: `Votre demande de ${LEAVE_TYPES[req.type].label} (${formatPeriod(req.start, req.end)}) a été approuvée`,
      date: TODAY, read: false,
    }, ...prev]);
    setNextId(n => n + 1);
    const emp = employees.find(e => e.id === req.eId);
    showToast(`Demande de ${emp ? emp.name : ''} approuvée ✓`);
  }

  function refuseRequest(reqId, reason) {
    const req = requests.find(r => r.id === reqId);
    if (!req) return;
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Refusé', reason } : r));
    const id = nextId;
    setNotifications(prev => [{
      id, rId: req.eId,
      msg: `Votre demande de ${LEAVE_TYPES[req.type].label} (${formatPeriod(req.start, req.end)}) a été refusée — ${reason}`,
      date: TODAY, read: false,
    }, ...prev]);
    setNextId(n => n + 1);
    showToast('Demande refusée');
  }

  function markNotifRead(id) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => {
      const mine = currentUser.role === 'manager' ? n.rId === 0 : n.rId === currentUser.id;
      return mine ? { ...n, read: true } : n;
    }));
  }

  function handleExport() {
    const rows = [['Employé', 'Type', 'Début', 'Fin', 'Jours', 'Statut', 'Soumis le']];
    requests.forEach(r => {
      const emp = employees.find(e => e.id === r.eId);
      rows.push([emp ? emp.name : '—', r.type, r.start, r.end, r.days, r.status, r.submitted]);
    });
    const csv = rows.map(r => r.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'conges.csv'; a.click();
    URL.revokeObjectURL(url);
    showToast('Export CSV téléchargé');
  }

  if (!currentUser) return <LoginScreen onLogin={login} />;

  const myNotifs = notifications.filter(n =>
    currentUser.role === 'manager' ? n.rId === 0 : n.rId === currentUser.id
  );
  const pendingCount = requests.filter(r => r.status === 'En attente').length;

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf9' }}>
      <Header
        user={currentUser}
        notifs={myNotifs}
        onLogout={logout}
        onMarkRead={markNotifRead}
        onMarkAllRead={markAllRead}
      />
      <NavTabs
        user={currentUser}
        activeTab={activeTab}
        onTab={setActiveTab}
        pendingCount={pendingCount}
        onExport={handleExport}
      />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px' }} key={activeTab}>
        <div className="anim-in">
          {activeTab === 'dashboard' && currentUser.role === 'employee' && (
            <EmployeeDashboard
              user={currentUser}
              employees={employees}
              requests={requests}
              onOpenModal={() => setModalOpen(true)}
            />
          )}
          {activeTab === 'dashboard' && currentUser.role === 'manager' && (
            <ManagerDashboard employees={employees} requests={requests} />
          )}
          {activeTab === 'calendar' && (
            <CalendarView user={currentUser} requests={requests} employees={employees} />
          )}
          {activeTab === 'pending' && currentUser.role === 'manager' && (
            <PendingRequestsView
              requests={requests}
              employees={employees}
              onApprove={approveRequest}
              onRefuse={refuseRequest}
            />
          )}
        </div>
      </main>

      {modalOpen && (
        <LeaveModal
          user={currentUser}
          employees={employees}
          onClose={() => setModalOpen(false)}
          onSubmit={submitRequest}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
