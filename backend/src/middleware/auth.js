const jwt = require('jsonwebtoken')
require('dotenv').config()

function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }
  const token = header.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
  const adminRoles = ['super_admin', 'ec_admin', 'cu_secretary', 'admin']
  if (!adminRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

function requireSuperAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
  if (!['super_admin', 'ec_admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Super admin access required' })
  }
  next()
}

module.exports = { authenticate, requireAdmin, requireSuperAdmin }