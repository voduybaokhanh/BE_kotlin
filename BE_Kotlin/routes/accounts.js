const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const { protect } = require("../middleware/auth");
const {
  accountValidationRules,
  handleValidationErrors,
} = require("../middleware/validator");

// Public routes
router.post(
  "/register",
  accountValidationRules(),
  handleValidationErrors,
  accountController.register
);
router.post("/login", accountController.login);

// Protected routes - require authentication
router.get("/me", protect, accountController.getMe);
router.put("/change-password", protect, accountController.changePassword);

// Routes for all accounts
router.get("/", protect, accountController.getAllAccounts);

// Routes that need authentication
router
  .route("/:email")
  .get(protect, accountController.getAccountByEmail)
  .put(protect, accountController.updateAccount)
  .delete(protect, accountController.deleteAccount);

module.exports = router;
