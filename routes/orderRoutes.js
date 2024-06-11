const express = require('express')
const router = express.Router()

const { getAllOrders, getSingleOrder, getCurrentUserOrders, createOrder, updateOrder } = require('../controllers/orderController')

const {authenticateUser, authorizerPermissions} = require('../middleware/authentication')

router.route('/').post(authenticateUser, createOrder).get(authenticateUser, authorizerPermissions('admin'), getAllOrders)

router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders)
router.route('/:id').get(authenticateUser, getSingleOrder).patch(authenticateUser, updateOrder)

module.exports = router

