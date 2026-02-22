const { getAllTicketMasters, updateRole, getAllUsers, createUser, updateUser, deleteUser, banUser, getUserById } = require('./userFunctions');
const { rejectSeller, getApplySellerById, getAllApplySellers, acceptSeller, getAllSellers, createSeller, banSeller, getSellerById, updateSeller, deleteSeller } = require('./sellerFunctions');
const {
    getAllProducts,
    getAllProductsOfSellerByUsername,
    updateProduct,
    deleteProduct,
    getProductById
} = require('./productFunctions');

module.exports = {
    getAllApplySellers, createSeller, acceptSeller, getAllUsers, createUser, updateUser, deleteUser, getAllSellers, updateSeller, deleteSeller, banUser, getAllProducts,
    updateRole, getAllProductsOfSellerByUsername,
    updateProduct, getUserById, rejectSeller,
    deleteProduct, getSellerById, banSeller,
    getAllTicketMasters, getApplySellerById,
    getProductById
};