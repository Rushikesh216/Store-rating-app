const db = require('../db');
const bcrypt = require('bcryptjs');
const Joi = require('joi');


exports.getValidOwners = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, owner_id FROM users WHERE role = "OWNER" ORDER BY name');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.dashboardStats = async (req, res) => {
  try {
    const [[{ total_users }]] = await db.query('SELECT COUNT(*) AS total_users FROM users');
    const [[{ total_stores }]] = await db.query('SELECT COUNT(*) AS total_stores FROM stores');
    const [[{ total_ratings }]] = await db.query('SELECT COUNT(*) AS total_ratings FROM ratings');
    res.json({ total_users, total_stores, total_ratings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const userSchema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email().required(),
  address: Joi.string().allow('').max(400).optional(),
  password: Joi.string().min(8).max(16).pattern(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).*$/).required(),
  role: Joi.string().valid('ADMIN', 'USER', 'OWNER').required(),
  owner_id: Joi.string().max(20).optional()
});

exports.createUser = async (req, res) => {
  try {
    const { value, error } = userSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const { name, email, address, password, owner_id } = value;
    const role = value.role.toUpperCase();
    
    // Validate owner_id if provided
    if (owner_id) {
      // Check if owner_id is already taken
      const [[existing]] = await db.query('SELECT id FROM users WHERE owner_id = ?', [owner_id]);
      if (existing) {
        return res.status(400).json({ error: `Owner ID '${owner_id}' is already taken` });
      }
      
      
      if (role !== 'OWNER') {
        return res.status(400).json({ error: 'Owner ID can only be assigned to users with OWNER role' });
      }
    }
    
    
    if (role === 'ADMIN') {
      const [[adminCount]] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "ADMIN"');
      if (adminCount.count >= 5) { // Limit to 5 admins
        return res.status(400).json({ error: 'Maximum number of administrators reached (5)' });
      }
    }
    
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, address, role, owner_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashed, address || null, role, owner_id || null]
    );
    res.status(201).json({ 
      id: result.insertId, 
      name, 
      email, 
      address, 
      role, 
      owner_id,
      message: `User created successfully with role: ${role}`
    });
  } catch (err) {
    
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email or Owner ID already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const { q = '', role, sort = 'name', order = 'asc' } = req.query;
    const allowedSort = ['name', 'email', 'address', 'role'];
    const sortCol = allowedSort.includes(sort) ? sort : 'name';
    const ord = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    const params = [];
    let where = 'WHERE 1=1';
    if (q) {
      where += ' AND (name LIKE ? OR email LIKE ? OR address LIKE ?)';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    if (role) {
      where += ' AND role = ?';
      params.push(role);
    }
    const [rows] = await db.query(
      `SELECT id, name, email, address, role, owner_id FROM users ${where} ORDER BY ${sortCol} ${ord}`,
      params
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const [[user]] = await db.query('SELECT id, name, email, address, role, owner_id FROM users WHERE id = ?', [userId]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    let owner_rating = null;
    if (String(user.role).toUpperCase() === 'OWNER') {
      const [[row]] = await db.query(
        `SELECT COALESCE(AVG(r.rating),0) AS rating
         FROM stores s LEFT JOIN ratings r ON s.id = r.store_id
         WHERE s.owner_id = ?`,
        [userId]
      );
      owner_rating = Number(row.rating);
    }
    res.json({ ...user, owner_rating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateUserOwnerId = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { owner_id } = req.body;
    
  
    if (!owner_id || typeof owner_id !== 'string' || owner_id.length > 20) {
      return res.status(400).json({ error: 'Owner ID must be a string with maximum 20 characters' });
    }
    
    
    const [[user]] = await db.query('SELECT id, name, role FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
   
    if (user.role !== 'OWNER') {
      return res.status(400).json({ error: 'Owner ID can only be assigned to users with OWNER role' });
    }
    
    
    const [[existing]] = await db.query('SELECT id FROM users WHERE owner_id = ? AND id != ?', [owner_id, userId]);
    if (existing) {
      return res.status(400).json({ error: `Owner ID '${owner_id}' is already taken by another user` });
    }
    
  
    await db.query('UPDATE users SET owner_id = ? WHERE id = ?', [owner_id, userId]);
    
    res.json({ 
      message: 'Owner ID updated successfully', 
      user_id: userId, 
      owner_id: owner_id,
      name: user.name 
    });
  } catch (err) {
    
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Owner ID already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

const storeSchema = Joi.object({
  name: Joi.string().min(1).max(60).required(),
  email: Joi.string().email().required(),
  address: Joi.string().allow('').max(400).optional(),
  owner_id: Joi.number().integer().optional()
});

exports.createStore = async (req, res) => {
  try {
    const { value, error } = storeSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const { name, email, address, owner_id } = value;
    
    
    if (owner_id) {
      const [[user]] = await db.query('SELECT id, role FROM users WHERE id = ?', [owner_id]);
      if (!user) {
        return res.status(400).json({ error: `User with ID ${owner_id} does not exist` });
      }
      if (user.role !== 'OWNER') {
        return res.status(400).json({ error: `User with ID ${owner_id} is not an OWNER (role: ${user.role})` });
      }
    }
    
    const [result] = await db.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address || null, owner_id || null]
    );
    res.status(201).json({ id: result.insertId, name, email, address, owner_id });
  } catch (err) {
    
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Store email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.updateStore = async (req, res) => {
  try {
    const storeId = Number(req.params.id);
    const { value, error } = storeSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const { name, email, address, owner_id } = value;
    
    
    const [[store]] = await db.query('SELECT id FROM stores WHERE id = ?', [storeId]);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
   
    if (owner_id) {
      const [[user]] = await db.query('SELECT id, role FROM users WHERE id = ?', [owner_id]);
      if (!user) {
        return res.status(400).json({ error: `User with ID ${owner_id} does not exist` });
      }
      if (user.role !== 'OWNER') {
        return res.status(400).json({ error: `User with ID ${owner_id} is not an OWNER (role: ${user.role})` });
      }
    }
    
    await db.query(
      'UPDATE stores SET name = ?, email = ?, address = ?, owner_id = ? WHERE id = ?',
      [name, email, address || null, owner_id || null, storeId]
    );
    res.json({ message: 'Store updated', id: storeId, name, email, address, owner_id });
  } catch (err) {
    
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Store email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.listStores = async (req, res) => {
  try {
    const { q = '', sort = 'name', order = 'asc' } = req.query;
    const allowedSort = ['name', 'email', 'address'];
    const sortCol = allowedSort.includes(sort) ? sort : 'name';
    const ord = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    const params = [];
    let where = 'WHERE 1=1';
    if (q) {
      where += ' AND (s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?)';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    const [rows] = await db.query(
      `SELECT s.id, s.name, s.email, s.address, COALESCE(AVG(r.rating),0) AS rating
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       ${where}
       GROUP BY s.id
       ORDER BY ${sortCol} ${ord}`,
      params
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteStore = async (req, res) => {
  try {
    const storeId = Number(req.params.id);
    
   
    const [[store]] = await db.query('SELECT id, name, owner_id FROM stores WHERE id = ?', [storeId]);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    
    const [[ratingCount]] = await db.query('SELECT COUNT(*) as count FROM ratings WHERE store_id = ?', [storeId]);
    
    
    let ownerInfo = null;
    if (store.owner_id) {
      const [[owner]] = await db.query('SELECT name, email FROM users WHERE id = ?', [store.owner_id]);
      ownerInfo = owner;
    }
    
    
    await db.query('DELETE FROM stores WHERE id = ?', [storeId]);
    
    res.json({ 
      message: 'Store deleted successfully',
      deleted_store: {
        id: storeId,
        name: store.name,
        owner_id: store.owner_id,
        owner_info: ownerInfo,
        ratings_deleted: ratingCount.count
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

