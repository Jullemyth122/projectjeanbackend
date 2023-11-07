const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// POST
router.post('/login', userController.login);
router.post('/sign-up', userController.signUp);
router.post('/update-password', userController.updatePassword);
router.post('/getUserByToken', userController.getUserByToken);

// GET
router.get('/get-all', userController.getAll);
router.get('/get-by-id/:id', userController.getById);



// PUT
router.put('/update-by-id/:id', userController.updateById);

// DELETE
router.delete('/delete-by-id/:id', userController.deleteById);
router.delete('/delete-all', userController.deleteAll);

module.exports = router;