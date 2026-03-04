export default async function handler(req, res) {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: 'username required' });
  }

  const DISCOURSE_URL = process.env.DISCOURSE_URL || 'https://port.jagunbae.com';
  const API_KEY = process.env.DISCOURSE_API_KEY || '';

  try {
    const resp = await fetch(`${DISCOURSE_URL}/u/${encodeURIComponent(username)}.json`, {
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
    // 민감한 정보 제거하고 필요한 것만 반환
    const user = data.user;
    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        avatar_template: user.avatar_template,
        title: user.title,
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
