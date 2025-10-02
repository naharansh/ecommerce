const Products = require("../schema/product");
const ProductMedia = require("../schema/productmedia");

exports.Uploads = async (req, res) => {
    try {
        const { productId } = req.params;
        console.log(productId)
        const products = await Products.findByPk(productId)
        if (!products) {
            return res.status(400).json({
                status: 'error',
                message: 'products are not found'
            })
        }
        const result = await ProductMedia.create(req.body)
        res.status(200).json({
            status: 'success',
            result
        })
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        })
    }

}
exports.DeleteData = async (req, res) => {
    try {
        console.log(req.params)
        const { pid, fid } = req.params

        let data = await ProductMedia.findByPk(pid)

        data = data.toJSON()
        console.log(data)
        if (!data.product_id === fid && !data.id === pid) {
            console.log('dfdfd')
            return res.status(400).json({
                status: 'error',
                message: 'product is not found'
            })
        }
        const result = await ProductMedia.destroy({ where: { id: pid } })
        console.log(result)
        res.status(201).json({
            status: 'success',
            data
        })

    } catch (error) {
        res.status(400).json({
            status:'error',
            err:error.message
        })
    }

}
