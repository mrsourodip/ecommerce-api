const express = require('express');
const router = express.Router();

const { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword } = require('../controllers/userController');

const {authenticateUser, authorizerPermissions} = require('../middleware/authentication')


router.route('/').get(authenticateUser, authorizerPermissions('admin'), getAllUsers);
router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/:id').get(authenticateUser, getSingleUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);
router.route('/updateUser').patch(authenticateUser, updateUser);


module.exports = router;