const express = require("express");
const { registerUser, 
        loginCustomer, 
        logout, 
        forgetPassword, 
        resetPassword,  
        getAllCustomers, 
        changePassword, 
        updateUserProfile, 
        getAllUsers,
        getParticularUser,
        updateUserRole,
        deleteUser} = require("../controllers/customer_controller");
const router = express.Router();
const {isAuthenticatedUser,authorizedRole, auth} =require("../middleware/auth")

router.route("/register").post(registerUser)
router.route("/login").post(loginCustomer)
// router.route("/auth/login").post(auth,loginCustomer)
router.route("/logout").get(logout)
router.route("/forget/password").post(forgetPassword)
router.route("/reset/password/:token").put(resetPassword)
router.route("/customerDetails").get(isAuthenticatedUser,getAllCustomers)
// router.route("/user/details").get(auth,getAllCustomers)
router.route("/change/password").put(isAuthenticatedUser,changePassword)
router.route("/user/change/password").put(auth,changePassword)
router.route("/update/profile").put(isAuthenticatedUser,updateUserProfile)
router.route("/user/update/profile").put(auth,updateUserProfile)
router.route("/admin/users").get(isAuthenticatedUser,authorizedRole("admin"),getAllUsers)
router.route("/admin/user/:id").get(isAuthenticatedUser,authorizedRole("admin"),getParticularUser)
                               .put(isAuthenticatedUser,authorizedRole("admin"),updateUserRole)
                               .delete(isAuthenticatedUser,authorizedRole("admin"),deleteUser)
module.exports = router;