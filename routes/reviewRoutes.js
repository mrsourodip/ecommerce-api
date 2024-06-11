const express = require('express')
const router = express.Router()

const {createReview, getAllReviews, getSingleReview, updateReview, deleteReview} = require('../controllers/reviewController')
const {authenticateUser, authorizerPermissions} = require('../middleware/authentication')

router.route('/').post(authenticateUser, authorizerPermissions('user'), createReview)
                .get(getAllReviews)
router.route('/:id').patch(authenticateUser, authorizerPermissions('user'), updateReview).delete(authenticateUser, authorizerPermissions('user'),deleteReview).get(getSingleReview)

module.exports = router