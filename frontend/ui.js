//export function log(msg) {
  //const logEl = document.getElementById('log');
  //const p = document.createElement('p');
  //p.textContent = msg;
  //logEl.appendChild(p);
//}

export function log(msg) {
  const logEl = document.getElementById('log');
  if (!logEl) return;
  const p = document.createElement('p');
  p.textContent = msg;
  logEl.appendChild(p);
  logEl.scrollTop = logEl.scrollHeight; // 👈 scroll to bottom
}
