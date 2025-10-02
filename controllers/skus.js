const Products = require("../schema/product");
const Sks = require("../schema/SKU");

exports.Addskus = async (req, res) => {
    console.log(req.body)
    const { productId } = req.params;
    const product = await Products.findByPk(productId)
    console.log(product)
    if (!product) {
        return res.status(404).json({ status: "error", message: "product not found" });
    }
    const result = await Sks.create(req.body)
    res.status(200).json({
        status: 'success',
        result
    })
}
exports.UpdateSkus = async (req, res) => {
    try {
        const { ids } = req.params
        console.log(ids)
        const sks = await Sks.findByPk(ids)
        if (!sks) {
            return res.status(404).json({ status: "error", message: "Product not found" });
        }
        const data = await sks.update(req.body)
        res.status(200).json({
            data
        })

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message

        })
    }

}
exports.Adjustment = async (req, res) => {  
    try {
        const { skuId } = req.params
        const { adjustment, reason } = req.body;
        if (!adjustment || isNaN(adjustment)) {
            return res.status(400).json({ status: "error", message: "Adjustment must be a number" });
        }
        const sku = await Sks.findByPk(skuId)
        if (!sku) {
            return res.status(400).json({
                status: 'error',
                message: 'SKU does not found'
            })
        }
        if (sku.stock_quantity + adjustment < 0) {
            return res.status(400).json({
                status: "error",
                message: "Insufficient stock for adjustment"
            });
        }
        sku.stock = sku.stock + adjustment

        await sku.save();
        res.json({
            status: "success",
            message: `Stock adjusted (${reason || "manual"})`,
            data: {
                sku_id: sku.sku_id,
                new_stock: sku.stock_quantity
            }
        });

    } catch (error) {
        res.json({
            status:'error',
            message:error.message
        })
    }

}