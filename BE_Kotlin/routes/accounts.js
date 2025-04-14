const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

/* GET accounts listing. */
router.get('/', accountController.getAllAccounts);

/* GET account by email */
router.get('/:email', accountController.getAccountByEmail);

/* POST create new account */
router.post('/', accountController.createAccount);

/* POST login */
router.post('/login', accountController.login);

/* PUT update account */
router.put('/:email', accountController.updateAccount);

/* DELETE account */
router.delete('/:email', accountController.deleteAccount);

module.exports = router;