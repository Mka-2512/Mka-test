export const LEAVE_TYPES = {
  CP:           { label: 'Congés Payés', color: '#2563eb', bg: '#eff6ff' },
  RTT:          { label: 'RTT',          color: '#7c3aed', bg: '#f5f3ff' },
  Maladie:      { label: 'Maladie',      color: '#dc2626', bg: '#fef2f2' },
  'Sans solde': { label: 'Sans solde',   color: '#d97706', bg: '#fffbeb' },
};

export const STATUS_META = {
  'En attente': { color: '#d97706', bg: '#fffbeb' },
  'Approuvé':   { color: '#16a34a', bg: '#f0fdf4' },
  'Refusé':     { color: '#dc2626', bg: '#fef2f2' },
};

export const MANAGER = { id: 0, name: 'Pierre Dumont', role: 'manager' };

export const EMPLOYEES = [
  { id: 1,  name: 'Sophie Martin',   cp: 20, rtt: 8  },
  { id: 2,  name: 'Lucas Bernard',   cp: 22, rtt: 9  },
  { id: 3,  name: 'Emma Dubois',     cp: 19, rtt: 7  },
  { id: 4,  name: 'Antoine Thomas',  cp: 25, rtt: 10 },
  { id: 5,  name: 'Chloé Robert',    cp: 21, rtt: 9  },
  { id: 6,  name: 'Maxime Petit',    cp: 11, rtt: 4  },
  { id: 7,  name: 'Inès Simon',      cp: 21, rtt: 7  },
  { id: 8,  name: 'Thomas Laurent',  cp: 17, rtt: 6  },
  { id: 9,  name: 'Camille Leroy',   cp: 21, rtt: 8  },
  { id: 10, name: 'Hugo Michel',     cp: 23, rtt: 9  },
  { id: 11, name: 'Léa Garcia',      cp: 24, rtt: 10 },
  { id: 12, name: 'Nicolas Moreau',  cp: 19, rtt: 7  },
  { id: 13, name: 'Julie Fontaine',  cp: 16, rtt: 6  },
  { id: 14, name: 'Alexis Blanc',    cp: 23, rtt: 9  },
  { id: 15, name: 'Marie Rousseau',  cp: 18, rtt: 7  },
];

export const INITIAL_REQUESTS = [
  { id:1,  eId:1,  type:'CP',         start:'2026-04-28', end:'2026-04-30', days:3, status:'En attente', reason:null, submitted:'2026-04-20' },
  { id:2,  eId:1,  type:'RTT',        start:'2026-04-07', end:'2026-04-08', days:2, status:'Approuvé',   reason:null, submitted:'2026-03-25' },
  { id:3,  eId:1,  type:'CP',         start:'2026-03-16', end:'2026-03-20', days:5, status:'Approuvé',   reason:null, submitted:'2026-03-01' },
  { id:4,  eId:1,  type:'Maladie',    start:'2026-02-10', end:'2026-02-12', days:3, status:'Approuvé',   reason:null, submitted:'2026-02-10' },
  { id:5,  eId:1,  type:'CP',         start:'2026-01-26', end:'2026-01-28', days:3, status:'Refusé',     reason:'Effectifs insuffisants cette semaine.', submitted:'2026-01-15' },
  { id:6,  eId:2,  type:'CP',         start:'2026-04-27', end:'2026-04-29', days:3, status:'En attente', reason:null, submitted:'2026-04-21' },
  { id:7,  eId:2,  type:'RTT',        start:'2026-03-10', end:'2026-03-10', days:1, status:'Approuvé',   reason:null, submitted:'2026-03-05' },
  { id:8,  eId:3,  type:'RTT',        start:'2026-05-04', end:'2026-05-05', days:2, status:'En attente', reason:null, submitted:'2026-04-22' },
  { id:9,  eId:3,  type:'Maladie',    start:'2026-04-14', end:'2026-04-16', days:3, status:'Approuvé',   reason:null, submitted:'2026-04-14' },
  { id:10, eId:4,  type:'RTT',        start:'2026-05-06', end:'2026-05-06', days:1, status:'En attente', reason:null, submitted:'2026-04-24' },
  { id:11, eId:5,  type:'CP',         start:'2026-05-11', end:'2026-05-15', days:5, status:'En attente', reason:null, submitted:'2026-04-23' },
  { id:12, eId:5,  type:'RTT',        start:'2026-04-02', end:'2026-04-02', days:1, status:'Approuvé',   reason:null, submitted:'2026-03-28' },
  { id:13, eId:6,  type:'CP',         start:'2026-04-20', end:'2026-04-24', days:5, status:'Approuvé',   reason:null, submitted:'2026-04-01' },
  { id:14, eId:7,  type:'CP',         start:'2026-04-22', end:'2026-04-23', days:2, status:'Approuvé',   reason:null, submitted:'2026-04-10' },
  { id:15, eId:8,  type:'Sans solde', start:'2026-04-29', end:'2026-04-29', days:1, status:'En attente', reason:null, submitted:'2026-04-24' },
  { id:16, eId:9,  type:'CP',         start:'2026-05-18', end:'2026-05-22', days:5, status:'En attente', reason:null, submitted:'2026-04-24' },
  { id:17, eId:10, type:'RTT',        start:'2026-04-17', end:'2026-04-17', days:1, status:'Approuvé',   reason:null, submitted:'2026-04-10' },
  { id:18, eId:11, type:'CP',         start:'2026-04-06', end:'2026-04-09', days:4, status:'Approuvé',   reason:null, submitted:'2026-03-25' },
  { id:19, eId:12, type:'RTT',        start:'2026-04-03', end:'2026-04-03', days:1, status:'Approuvé',   reason:null, submitted:'2026-03-30' },
  { id:20, eId:13, type:'CP',         start:'2026-04-28', end:'2026-04-30', days:3, status:'En attente', reason:null, submitted:'2026-04-22' },
  { id:21, eId:14, type:'Maladie',    start:'2026-04-13', end:'2026-04-15', days:3, status:'Approuvé',   reason:null, submitted:'2026-04-13' },
  { id:22, eId:15, type:'CP',         start:'2026-05-25', end:'2026-05-29', days:5, status:'En attente', reason:null, submitted:'2026-04-23' },
];

export const INITIAL_NOTIFICATIONS = [
  { id:1,  rId:0, msg:'Sophie Martin a soumis une demande de CP (3j, 28–30 avr.)',        date:'2026-04-20', read:false },
  { id:2,  rId:0, msg:'Lucas Bernard a soumis une demande de CP (3j, 27–29 avr.)',        date:'2026-04-21', read:false },
  { id:3,  rId:0, msg:'Emma Dubois a soumis une demande de RTT (2j, 04–05 mai)',          date:'2026-04-22', read:false },
  { id:4,  rId:0, msg:'Julie Fontaine a soumis une demande de CP (3j, 28–30 avr.)',       date:'2026-04-22', read:false },
  { id:5,  rId:0, msg:'Chloé Robert a soumis une demande de CP (5j, 11–15 mai)',          date:'2026-04-23', read:true  },
  { id:6,  rId:0, msg:'Marie Rousseau a soumis une demande de CP (5j, 25–29 mai)',        date:'2026-04-23', read:true  },
  { id:7,  rId:0, msg:'Antoine Thomas a soumis une demande de RTT (1j, 06 mai)',               date:'2026-04-24', read:true  },
  { id:8,  rId:0, msg:'Thomas Laurent a soumis une demande de Sans solde (1j, 29 avr.)',       date:'2026-04-24', read:true  },
  { id:9,  rId:0, msg:'Camille Leroy a soumis une demande de CP (5j, 18–22 mai)',         date:'2026-04-24', read:true  },
  { id:10, rId:1, msg:'Votre demande de RTT (07–08 avr.) a été approuvée',                date:'2026-03-26', read:false },
  { id:11, rId:1, msg:'Votre demande de CP (16–20 mars) a été approuvée',                 date:'2026-03-02', read:true  },
  { id:12, rId:1, msg:'Votre demande de CP (26–28 janv.) a été refusée — Effectifs insuffisants', date:'2026-01-16', read:true },
  { id:13, rId:2, msg:'Votre demande de RTT (10 mars) a été approuvée',                        date:'2026-03-06', read:false },
  { id:14, rId:3, msg:'Votre demande de Maladie (14–16 avr.) a été approuvée',            date:'2026-04-15', read:false },
  { id:15, rId:5, msg:'Votre demande de RTT (02 avr.) a été approuvée',                        date:'2026-03-29', read:false },
  { id:16, rId:7, msg:'Votre demande de CP (22–23 avr.) a été approuvée',                 date:'2026-04-11', read:false },
];

export const TODAY = '2026-04-25';
