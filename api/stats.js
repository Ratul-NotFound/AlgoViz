// api/stats.js — Serverless Endpoint for Registered Users Count (MongoDB Atlas)
import { getMongoClient } from './_mongo.js';

const BASE_USER_OFFSET = 120;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const client = await getMongoClient();
    if (!client) {
      return res.status(200).json({ count: BASE_USER_OFFSET });
    }

    const db = client.db('algoflowx');
    const users = db.collection('users');

    const dbCount = await users.countDocuments();
    const totalCount = BASE_USER_OFFSET + (dbCount || 0);

    return res.status(200).json({
      count: totalCount,
      dbRegistered: dbCount,
      baseOffset: BASE_USER_OFFSET,
    });
  } catch (err) {
    console.warn('[MongoDB API] Error in /api/stats:', err.message);
    return res.status(200).json({ count: BASE_USER_OFFSET });
  }
}
