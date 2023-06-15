const express = require('express');
const { getAllProducts,
        createproduct, 
        updateProduct, 
        deleteProduct, 
        getProductDetails,
        createProductReview,
        getProductReviews,
        deleteProductReview,
        getAdminProducts} = require('../controllers/product_controllers');
const { isAuthenticatedUser,authorizedRole,auth }= require('../middleware/auth');

const router = express.Router();
router.route('/product').get(getAllProducts)
router.route('/admin/products').get(isAuthenticatedUser,authorizedRole("admin"), getAdminProducts)
router.route('/admin/product/new').post(isAuthenticatedUser,authorizedRole("admin"),createproduct)
router.route('/admin/product/:id').put(isAuthenticatedUser,authorizedRole("admin"),updateProduct)
                            .delete(isAuthenticatedUser,authorizedRole("admin"),deleteProduct)
                            router.route("/product/:id").get(getProductDetails)

router.route('/review').put(isAuthenticatedUser,createProductReview)
router.route('/give/review').put(auth,createProductReview)

router.route('/reviews').get(getProductReviews).delete(isAuthenticatedUser,deleteProductReview)
module.exports = router;