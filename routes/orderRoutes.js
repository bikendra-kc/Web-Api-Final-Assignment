const express = require("express")
const {createOrder, 
       getSingleOrder,
       myOrders,
       getAllOrders,
       updateOrder,
       deleteOrder,
       createOrderHistory,
  getOrderHistory,
                   } = require("../controllers/order_controller")
const {isAuthenticatedUser,authorizedRole,auth}=require("../middleware/auth")
const router = express.Router();

router.route("/order/create").post(isAuthenticatedUser,createOrder)
router.route("/order/my").get(isAuthenticatedUser,myOrders)
router.route("/order/getall").get(isAuthenticatedUser,getAllOrders)
router.route("/admin/orders").get(isAuthenticatedUser,authorizedRole("admin"),getAllOrders)
router.route("/user/order/getall").get(auth,getAllOrders)
router.route("/order/:id").get(isAuthenticatedUser,getSingleOrder)
router.route("/getsingleorder/:id").get(auth,getSingleOrder)
router.route("/order/update/:id").put(isAuthenticatedUser,authorizedRole("admin"),updateOrder)
                                 .delete(isAuthenticatedUser,authorizedRole("admin"),deleteOrder)

// ==========================================================------
router.route("/order/flutter/create").post(createOrderHistory);
router.route("/order/flutter/:id").get(getOrderHistory);
module.exports = router;
// ======================================-------------------------


