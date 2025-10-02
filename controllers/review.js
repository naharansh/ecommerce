const Products = require('../schema/product.js')
const Review = require('../schema/reviews.js')
// const { Approved } = require('./vendorcontrollers.js')
exports.CreateReview = async (req, res) => {
    try {
        console.log(req.params)
        const { ids } = req.params
        console.log(req.users)
        const userId = req.users.user_id
        const product = await Products.findByPk(ids)
        const { ratings, body, title } = req.body
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product does not found'
            })
        }
        const existing = await Review.findAll({ where: { product_id: ids, user_id: userId } })
        console.log(existing)
        if (existing.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'You have already reviewed this product'
            });
        }
        const review = await Review.create({
            product_id: ids,
            user_id: userId,
            ratings,
            title,
            body
        })
        console.log(review)
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message
        })
    }
}
exports.GetReviews = async (req, res) => {

    try {
        const { ids } = req.params
        const result = await Review.findAll({ where: { product_id: ids } })
        if (!result) {
            return res.status(400).json({
                status: 'error',
                message: 'review is not exist'
            })
        }
        res.status(200).json({
            status: 'success',
            result
        })

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message
        })
    }

}
exports.IsApprove = async (req, res) => {
    try {
        const role = req.users.role;

        if (role === 'admin') {
            const { ids } = req.params
            let find = await Review.findByPk(ids)
             console.log(find)

            if (!find) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Review not found'
                });
            }

             find.approved = req.body.approved ?? true;
            const result = await find.save(); // ✅ save instance
            
            console.log(result)
            res.status(200).json({
                status: 'success',
                message: 'approved are updated'
            })
        } else {
            res.status(200).json({
                status: 'success',
                message: 'fsys id ed'
            })
        }

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message
        })
    }

}