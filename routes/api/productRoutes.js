const router = require('express').Router();
const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../../controllers/productController');

// /api/products
router.route('/')
  .get(getAllProducts)
  .post(createProduct);

// /api/products/:id
router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

// /api/products/category/:category
router.route('/category/:category')
  .get(getProductsByCategory);

module.exports = router;
