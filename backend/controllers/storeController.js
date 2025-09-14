const db = require('../db');
const Joi = require('joi');


exports.getAllStores = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const { q = '' } = req.query;
    const params = [];
    let where = '';
    if (q) {
      where = 'WHERE s.name LIKE ? OR s.address LIKE ?';
      params.push(`%${q}%`, `%${q}%`);
    }
    const [stores] = await db.query(
      `SELECT s.id, s.name, s.email, s.address,
              COALESCE(AVG(r.rating), 0) AS avg_rating,
              MAX(CASE WHEN r2.user_id = ? THEN r2.rating ELSE NULL END) AS user_rating
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       LEFT JOIN ratings r2 ON s.id = r2.store_id
       ${where}
       GROUP BY s.id`,
      [userId, ...params]
    );
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const ratingSchema = Joi.object({
  store_id: Joi.number().integer().required(),
  rating: Joi.number().integer().min(1).max(5).required()
});

exports.submitRating = async (req, res) => {
  const userId = req.user?.id || req.body.user_id; 
  const { value, error } = ratingSchema.validate(req.body);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (error) return res.status(400).json({ error: error.message });
  const { store_id, rating } = value;
  try {
    await db.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
      [userId, store_id, rating]
    );
    res.json({ message: 'Rating saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getMyRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      `SELECT r.id, r.store_id, r.rating, r.created_at, s.name AS store_name, s.address AS store_address
       FROM ratings r
       INNER JOIN stores s ON r.store_id = s.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};