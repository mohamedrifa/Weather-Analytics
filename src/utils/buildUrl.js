export function buildUrl(base, params) {
  const query = new URLSearchParams(params).toString();
  return `${base}?${query}`;
}
