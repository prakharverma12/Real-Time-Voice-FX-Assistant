export async function getIntent(text) {
  const res = await fetch("http://localhost:5000/api/intent", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  return data.effects || [];
}
