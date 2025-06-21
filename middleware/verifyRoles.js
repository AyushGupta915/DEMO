const verifiedRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) {
            return res.status(401).json({ message: "Unauthorized: No roles found" });
        }

        const rolesArray = [...allowedRoles];
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);

        if (!result) {
            return res.status(403).json({ message: "Forbidden: You do not have the required role" });
        }

        next();
    }
}

module.exports = verifiedRoles;