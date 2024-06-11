const express = require('express');
const router = express.Router();
const { getSingleProduct,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage, } = require('../controllers/productController')
    
const {authenticateUser, authorizerPermissions} = require('../middleware/authentication')

const {getSingleProductsReview}  = require('../controllers/reviewController')

router.route('/').post(authenticateUser, authorizerPermissions('admin'), createProduct)
router.route('/').get(getAllProducts)
router.route('/uploadImage').post(authenticateUser, authorizerPermissions('admin'), uploadImage)
router.route('/:id').get(getSingleProduct)
router.route('/:id').patch(authenticateUser, authorizerPermissions('admin'), updateProduct)
router.route('/:id').delete(authenticateUser, authorizerPermissions('admin'), deleteProduct)
router.route('/:id/reviews').get(getSingleProductsReview)

module.exports = router
