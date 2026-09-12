// api/user.js — Serverless Endpoint for User Profile Synchronization (MongoDB Atlas)
import clientPromise from './_mongo.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!clientPromise) {
    return res.status(503).json({ error: 'MongoDB connection string not configured' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('algoflowx');
    const users = db.collection('users');

    // GET /api/user?id=123 -> fetch user profile
    if (req.method === 'GET') {
      const { id } = req.query || {};
      if (!id) {
        return res.status(400).json({ error: 'Missing user ID' });
      }

      const user = await users.findOne({ id: String(id) });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json(user);
    }

    // POST /api/user -> upsert user profile & progress
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { id, email, name, picture, provider, bookmarked_algos, completed_algos, c_completed_lessons } = body;

      if (!id) {
        return res.status(400).json({ error: 'Missing required field: id' });
      }

      const updateDoc = {
        $set: {
          id: String(id),
          email: email || null,
          name: name || null,
          picture: picture || null,
          provider: provider || 'google',
          bookmarked_algos: Array.isArray(bookmarked_algos) ? bookmarked_algos : [],
          completed_algos: Array.isArray(completed_algos) ? completed_algos : [],
          c_completed_lessons: Array.isArray(c_completed_lessons) ? c_completed_lessons : [],
          last_login: new Date().toISOString(),
        },
        $setOnInsert: {
          created_at: new Date().toISOString(),
        },
      };

      const result = await users.updateOne({ id: String(id) }, updateDoc, { upsert: true });

      return res.status(200).json({ success: true, result });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('[MongoDB API] Error in /api/user:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
