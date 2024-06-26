const Order = require('../models/order')
const Product = require('../models/product')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const {checkPermissions} = require('../utils')

const fakeStripeAPI = async({amount, currency}) => {
    const client_secret = 'someRandomValue'
    return {client_secret, amount}
}

const createOrder = async(req, res) => {
    const {items:cartItems, tax, shippingFee} = req.body
    
    if(!cartItems || cartItems.length < 1)
        throw new CustomError.BadRequestError('No cart items provided!')
    if(!tax || !shippingFee)
        throw new CustomError.BadRequestError('Please provide tax and shipping fee')
    
    let orderItems = []
    let subtotal = 0
    
    for(const item of cartItems) {
        const dbProduct = await Product.findOne({_id: item.product})
        if(!dbProduct) throw new CustomError.NotFoundError(`Product with id ${item.product} not found!`)
        const {name, price, image, _id} = dbProduct
        console.log(name, price, image);
        const singleOrderItem = {
            amount: item.amount,
            name, price, image, product:_id
        }
        // add item to order
        orderItems = [...orderItems,singleOrderItem]
        // calculate subTotal
        subtotal += item.amount* price
    }
    // calculate total
    const total = tax + shippingFee + subtotal
    // get client secret
    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'usd'
    })
    
    const order = await Order.create({
        orderItems, tax, total, subtotal, shippingFee, clientSecret: paymentIntent.client_secret,user:req.user.userId
    })
    res.status(StatusCodes.CREATED).json({order, clientSecret: order.clientSecret})
}
const getAllOrders = async(req, res) => {
    const orders = await Order.find({})
    res.status(StatusCodes.OK).json({orders, count: orders.length})
}
const getSingleOrder = async(req, res) => {
    const orderId = req.params.id
    const order = await Order.findOne({_id: orderId})
    if(!order) throw new CustomError.NotFoundError(`No order found with id ${orderId}`)
    checkPermissions(req.user, order.user)
    res.status(StatusCodes.OK).json({order})
}
const getCurrentUserOrders = async(req, res) => {
    const userId = req.user.userId
    const orders = await Order.findOne({user: userId})
    res.status(StatusCodes.OK).json({orders, count: orders?.length})
}
const updateOrder = async(req, res) => {
    const orderId = req.params.id
    const {paymentIntentId} = req.body
    const order = await Order.findOne({_id: orderId})
    if(!order) throw new CustomError.NotFoundError(`No order found with id ${orderId}`)
    checkPermissions(req.user, order.user)
    order.paymentIntentId = paymentIntentId
    order.status = 'paid'
    await order.save()
    res.status(StatusCodes.OK).json({order})
}

module.exports = {
    getAllOrders, getSingleOrder, getCurrentUserOrders, createOrder, updateOrder
}