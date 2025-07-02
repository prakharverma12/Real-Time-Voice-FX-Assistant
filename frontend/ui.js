export function log(msg) {
  const logEl = document.getElementById('log');
  const p = document.createElement('p');
  p.textContent = msg;
  logEl.appendChild(p);
}
