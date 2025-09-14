const db = require('../db');
const Joi = require('joi');

exports.myStoreRaters = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const [stores] = await db.query('SELECT id FROM stores WHERE owner_id = ?', [ownerId]);
    if (!stores.length) return res.json([]);
    const storeId = stores[0].id;
    const [rows] = await db.query(
      `SELECT r.id, r.rating, u.id AS user_id, u.name, u.email
       FROM ratings r
       INNER JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY u.name ASC`,
      [storeId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.myStoreAverage = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const [[row]] = await db.query(
      `SELECT COALESCE(AVG(r.rating),0) AS average
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.owner_id = ?`,
      [ownerId]
    );
    res.json({ average: Number(row.average) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const storeSchema = Joi.object({
  name: Joi.string().min(1).max(60).required(),
  email: Joi.string().email().required(),
  address: Joi.string().allow('').max(400).optional()
});


exports.getMyStore = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const [stores] = await db.query('SELECT id, name, email, address, owner_id FROM stores WHERE owner_id = ?', [ownerId]);
    if (!stores.length) return res.json(null);
    return res.json(stores[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.upsertMyStore = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { value, error } = storeSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const { name, email, address } = value;

    const [existing] = await db.query('SELECT id FROM stores WHERE owner_id = ?', [ownerId]);
    if (existing.length) {
      const storeId = existing[0].id;
      await db.query('UPDATE stores SET name = ?, email = ?, address = ? WHERE id = ?', [name, email, address || null, storeId]);
      return res.json({ message: 'Store updated', id: storeId, name, email, address, owner_id: ownerId });
    } else {
      const [result] = await db.query('INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)', [name, email, address || null, ownerId]);
      return res.status(201).json({ message: 'Store created', id: result.insertId, name, email, address, owner_id: ownerId });
    }
  } catch (err) {
    
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Store email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};


exports.deleteMyStore = async (req, res) => {
  try {
    const ownerId = req.user.id;
    
   
    const [stores] = await db.query('SELECT id, name FROM stores WHERE owner_id = ?', [ownerId]);
    if (!stores.length) {
      return res.status(404).json({ error: 'No store found for this owner' });
    }
    
    const storeId = stores[0].id;
    const storeName = stores[0].name;
    
    
    const [[ratingCount]] = await db.query('SELECT COUNT(*) as count FROM ratings WHERE store_id = ?', [storeId]);
    
    
    await db.query('DELETE FROM stores WHERE id = ? AND owner_id = ?', [storeId, ownerId]);
    
    res.json({ 
      message: 'Store deleted successfully',
      deleted_store: {
        id: storeId,
        name: storeName,
        ratings_deleted: ratingCount.count
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

