const Products = require('../schema/product.js')
const Vendors = require('../schema/vendors.js')

const utils = require('util')
const jsonWebToken = require('jsonwebtoken')
const Shops = require('../schema/vendors.js')
exports.CreateProduct = async (req, res) => {
    try {
        const { ids } = req.params;
        console.log(ids)
        console.log(req.body)
        const vendor = await Vendors.findByPk(ids)
        console.log(vendor)
        if (!vendor) {
            return res.status(404).json({ status: "error", message: "Vendor not found" });
        }
        if (req.users.role != 'admin' && vendor.user_id != req.users.user_id) {
            return res.status(403).json({ status: "error", message: "Forbidden: Only owner/admin can add products" });
        }
        const result = await Products.create(req.body)
        console.log(result)
        return res.status(201).json({
            status: "success",
            message: "Product added successfully",
            ids: result.toJSON().product_id

        });
    } catch (err) {
        console.log(err)
    }
}
exports.Details = async (req, res) => {
    try {
        const { productsId } = req.params;
        const result = await Products.findByPk(productsId)
        res.status(200).json({
            status: 'success',
            result
        })
    } catch (error) {
        console.log(error)
    }
}
exports.UpdateDetails = async (req, res) => {
    try {
        const { ids } = req.params
        let products = await Products.findByPk(ids, {
            include: [
                {
                    model: Shops,
                    as: "vid",
                    attributes: ["vender_id", "name", "status", "user_id"]
                }
            ]
        })
        if (!products) {
            return res.status(404).json({ status: "error", message: "Product not found" });
        }
        products = products.toJSON()
        console.log(products)
        console.log(products.vid.user_id)
        if (req.users.role !== "admin" && req.users.user_id !== products.vid.user_id) {
            return res.status(403).json({ status: "error", message: "Forbidden" });
        }
        products.title = title ?? products.title;
        products.slug = slug ?? products.slug;
        products.short_description = short_description ?? products.short_description;
        products.long_description = long_description ?? products.long_description;
        products.status = status ?? products.status;
        products.is_featured = is_featured ?? products.is_featured;

        await products.save();
        return res.json({ status: "success", products });
    } catch (error) {
        res.json({
            status: 'error',
            err: error.message
        })
    }
}
exports.DeleteProducts = async (req, res) => {
    try {
        const { ids } = req.params
        let products = await Products.findByPk(ids, {
            include: [
                {
                    model: Shops,
                    as: "vid",
                    attributes: ["vender_id", "name", "status", "user_id"]
                }]
        })

        if (!products) {
            return res.status(404).json({ status: "error", message: "Product not found" });
        }
         products = products.toJSON()
        if (req.users.role !== "admin" && req.users.user_id !== products.vid.user_id) {
            return res.status(403).json({ status: "error", message: "Forbidden" });
        }
        const deleted=await Products.destroy({
            where:{product_id:ids}
        })
        res.status(201).json({
            status:'success',
            deleted
        })

    } catch (error) {
        console.log(error)
        res.status(505).json({
            status: 'error',
            message: error.message
        })
    }
}
exports.FindProducts=async (req,res) => {
    try{

    }
    catch(err)
    {
        res.status(505).json({
            status:'error',
            message:err.message
        })
    }    
}