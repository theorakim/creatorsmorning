export default async function handler(req, res) {
  const { username, filter, offset } = req.query;
  if (!username) {
    return res.status(400).json({ error: 'username required' });
  }

  const DISCOURSE_URL = process.env.DISCOURSE_URL || 'https://port.jagunbae.com';
  const API_KEY = process.env.DISCOURSE_API_KEY || '';

  const params = new URLSearchParams({
    username,
    filter: filter || '4',
    offset: offset || '0',
  });

  try {
    const resp = await fetch(`${DISCOURSE_URL}/user_actions.json?${params}`, {
      headers: {
        'Api-Key': API_KEY,
        'Api-Username': 'system',
        'Accept': 'application/json',
      },
    });

    if (!resp.ok) {
      return res.status(resp.status).json({ error: `Discourse returned ${resp.status}` });
    }

    const data = await resp.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
