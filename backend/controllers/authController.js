const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const signupSchema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email().required(),
  address: Joi.string().allow('').max(400).optional(),
  password: Joi.string()
    .min(8)
    .max(16)
    .pattern(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).*$/)
    .required(),
  role: Joi.string().valid('ADMIN', 'USER', 'OWNER').default('USER')
});

exports.signup = async (req, res) => {
  try {
    const { value, error } = signupSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const { name, email, address, password } = value;
    const role = (value.role || 'USER').toUpperCase();
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashed, address || null, role]
    );

    res.status(201).json({ id: result.insertId, name, email, address, role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

exports.login = async (req, res) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const { email, password } = value;

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const normalizedRole = String(user.role).toUpperCase();
    const token = jwt.sign({ id: user.id, role: normalizedRole }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, address: user.address, role: normalizedRole } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const passwordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .max(16)
    .pattern(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).*$/)
    .required()
});

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { value, error } = passwordSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const { currentPassword, newPassword } = value;

    const [rows] = await db.query('SELECT password FROM users WHERE id = ?', [userId]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    const ok = await bcrypt.compare(currentPassword, rows[0].password);
    if (!ok) return res.status(401).json({ error: 'Invalid current password' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, userId]);
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.logout = async (req, res) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

