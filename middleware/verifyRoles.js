const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("🔥 [verifyRoles] allowedRoles:", allowedRoles);
    console.log("🔥 [verifyRoles] req.roles:", req.roles);

    if (!req?.roles || !Array.isArray(req.roles)) {
      return res.status(401).json({ message: "Unauthorized: Roles not available" });
    }

    const hasRole = req.roles.some(role => allowedRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: "Forbidden: You do not have the required role" });
    }

    next();
  };
};

module.exports = verifyRoles;