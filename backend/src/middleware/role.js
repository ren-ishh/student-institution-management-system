// ============================================
//  ROLE MIDDLEWARE
//  Use after authenticate()
//  e.g. authorize('admin') or authorize('admin','faculty')
// ============================================

export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }
    next();
  };
}