const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { protect, authorize } = require('../middleware/auth');
const { accountValidationRules, handleValidationErrors } = require('../middleware/validator');

// Public routes
router.post('/register', accountValidationRules(), handleValidationErrors, accountController.register);
router.post('/login', accountController.login);

// Protected routes - require authentication
router.get('/me', protect, accountController.getMe);
router.put('/change-password', protect, accountController.changePassword);

// Admin only routes
router.get('/', protect, authorize('admin'), accountController.getAllAccounts);

// Routes that need authentication and specific permissions
router.route('/:email')
  .get(protect, accountController.getAccountByEmail)
  .put(protect, accountController.updateAccount)
  .delete(protect, authorize('admin'), accountController.deleteAccount);

module.exports = router;