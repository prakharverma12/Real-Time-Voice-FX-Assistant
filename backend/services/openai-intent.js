// Replace with OpenAI SDK call if needed
export async function parseIntent(text) {
  const keywords = text.toLowerCase();
  const effects = [];

  if (keywords.includes('reverb')) effects.push('reverb');
  if (keywords.includes('delay') || keywords.includes('echo')) effects.push('delay');
  if (keywords.includes('pitch')) effects.push('pitch-shift');
  if (keywords.includes('low')) effects.push('low-pass');
  if (keywords.includes('high')) effects.push('high-pass');
  if (keywords.includes('gain')) effects.push('gain');

  return effects;
}
