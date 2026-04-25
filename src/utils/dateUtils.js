export function countWorkingDays(start, end) {
  let n = 0;
  const cur = new Date(start + 'T00:00:00');
  const fin = new Date(end + 'T00:00:00');
  while (cur <= fin) {
    const d = cur.getDay();
    if (d !== 0 && d !== 6) n++;
    cur.setDate(cur.getDate() + 1);
  }
  return n;
}

export function formatDate(s) {
  if (!s) return '';
  return new Date(s + 'T00:00:00').toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

export function formatPeriod(a, b) {
  return a === b ? formatDate(a) : formatDate(a) + ' – ' + formatDate(b);
}

export function formatRelDate(s) {
  if (!s) return '';
  return new Date(s + 'T00:00:00').toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short',
  });
}

export function toDateStr(y, m, d) {
  return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
}

export function isWeekend(y, m, d) {
  const w = new Date(y, m, d).getDay();
  return w === 0 || w === 6;
}
