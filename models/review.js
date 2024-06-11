const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: 1,
        max: 5,
    },
    title: {
        type: String,
        required: [true, 'Please provide a review title'],
        maxlength: 100
    },
    comment: {
        type: String,
        required: [true, 'Please provide a comment'],
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
}, { timestamps: true })

// to ensure that for each product, only the user can put a review once
ReviewSchema.index({ product:1, user:1}, {unique: true})

// to calculate average rating
ReviewSchema.statics.calculateAverageRating = async function(productId) {
    const result = await this.aggregate([
        {$match: {product: productId}},
        {$group: {
            _id: '$product'||null,
            averageRating: {$avg: '$rating'},
            numOfReviews: {$sum:1}
        }}
    ])
    console.log(result)
    try {
        await this.model('Product').findOneAndUpdate({_id:productId},{
            averageRating: Math.ceil(result[0]?.averageRating|| 0),
            numOfReviews: result[0]?.numOfReviews|| 0
        })
    } catch(error) {
        console.log(error)
    }
}

// save hook is called at create and update
ReviewSchema.post('save', async function() {
    await this.constructor.calculateAverageRating(this.product)
})

// delete post hook is called when remove is used and not delete
ReviewSchema.post('remove', async function() {
    await this.constructor.calculateAverageRating(this.product)
})

module.exports = mongoose.model('Review', ReviewSchema)