const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const Product = require('../models/product')
const path = require('path')

const createProduct = async(req, res) => {
    req.body.user = req.user.userId
    const product = await Product.create(req.body)
    // console.log(product)
    res.status(StatusCodes.CREATED).json({product})
}
const getAllProducts = async(req, res) => {
    const products = await Product.find({})
    res.status(StatusCodes.OK).json({products, count: products.length})
}
const getSingleProduct = async(req, res) => {
    const { id: productId } = req.params;
    // const product = await Product.findOne({_id: productId}).populate('reviews')
    const product = await Product.findOne({_id: productId})
    if(!product) throw new CustomError.NotFoundError(`No product found with id: ${productId}`)
    res.status(StatusCodes.OK).json({product})
}
const updateProduct = async(req, res) => {
    const { id: productId } = req.params;
    // findOneAndUpdate does not call any pre-save or post-save hook if present in model
    const product = await Product.findOneAndUpdate({_id: productId}, req.body, {new: true,
    runValidators: true})
    if(!product) throw new CustomError.NotFoundError(`No product found with id: ${productId}`)
    res.status(StatusCodes.OK).json({product})
}
const deleteProduct = async(req, res) => {
    const { id: productId } = req.params;
    const product = await Product.findOne({ _id: productId });
    if(!product) throw new CustomError.NotFoundError(`No product found with id: ${productId}`)
    // used for calling pre-remove hook
    await product.remove()
    res.status(StatusCodes.OK).json({msg: 'Product is succesfully removed'})
}
// image upload using 
const uploadImage = async(req, res) => {
    if(!req.files) throw new CustomError.BadRequestError('No file uploaded!')
    console.log(req.files)
    const productImage = req.files.image;
    // if it does not start with image, then throw error
    if(!productImage.mimetype.startsWith('image')) throw new CustomError.BadRequestError('Please Upload Image')
    const maxSize = 1024 * 1024
    // if max size exceeded, use the size property in productImage
    if(productImage.size > maxSize) throw new CustomError.BadRequestError('Please upload image smaller than 1 mb')
    // calculate imagePath
    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`)
    await productImage.mv(imagePath)
    res.status(StatusCodes.OK).json({image: `/uploads/${productImage.name}`})
}

module.exports = {
    getSingleProduct,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
}