const hierarchyTree = {
    "admin": ["seller", "user"],
    "superadmin": ["admin", "seller", "user"],
    "root": ["superadmin", "admin", "seller", "user"]
};

module.exports = hierarchyTree;