const jwt = require('jsonwebtoken');

exports.requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.user = { ...payload, role: String(payload.role).toUpperCase() };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

exports.requireRoles = (...roles) => (req, res, next) => {
  const allowed = roles.map(r => String(r).toUpperCase());
  if (!req.user || !allowed.includes(String(req.user.role).toUpperCase())) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

exports.optionalAuth = (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.user = { ...payload, role: String(payload.role).toUpperCase() };
  } catch (_e) {
    
  }
  next();
};

