const hierarchyTree = {
    "admin": ["seller", "user"],
    "superadmin": ["admin", "seller", "user"],
    "root": ["superadmin", "admin", "seller", "user"]
};

const authorizeChangeMiddleware = (userRole, req, res) => {
    const { role } = req.user;
    if (!hierarchyTree[role].includes(userRole)) {
        res.status(499).json({ message: `You are not authorized to perform this action on a ${userRole}` });
        return -1;
    }
};

module.exports = authorizeChangeMiddleware;