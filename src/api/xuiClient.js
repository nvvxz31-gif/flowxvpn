const XUI_BASE = 'https://31.76.76.232:54542/A3zJvbWxwnKqzNufNL/panel/api';
const XUI_TOKEN = '9kVTw68UT4IhfNqFazyGPhtAAGodbUgL';

async function xuiRequest(endpoint, options = {}) {
  const url = `${XUI_BASE}${endpoint}`;
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${XUI_TOKEN}`,
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(`XUI API ${res.status}`);
  return res.json();
}

export const xui = {
  getInbounds: () => xuiRequest('/inbounds/list'),
  getInbound: (id) => xuiRequest(`/inbounds/get/${id}`),
  addClient: (inboundId, email) => xuiRequest(`/inbounds/addClient`, {
    method: 'POST',
    body: JSON.stringify({ id: inboundId, settings: { clients: [{ email, enable: true }] } }),
  }),
  delClient: (inboundId, uuid) => xuiRequest(`/inbounds/${inboundId}/delClient/${uuid}`, { method: 'POST' }),
  getClientTraffic: (email) => xuiRequest(`/inbounds/getClientTraffic/${email}`),
  resetTraffic: (inboundId) => xuiRequest(`/inbounds/${inboundId}/resetAllTraffics`, { method: 'POST' }),
};