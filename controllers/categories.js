// const { trace } = require('../routes/categories');
const categories=require('../schema/categories.js')
const Attributes=require('../schema/attributes.js')
exports.Getcategories=async (req,res) => {   
    try {
        const categoriess=await categories.findAll({
            include:[{model:categories,as: "categories",attributes:["cat_id","name"]}]
        })
        if (!categories) {
                res.status(400).json({
                    status:'error',
                    message:'categories are empty'
                })            
        }
        res.status(201).json({ status: "success", data: categoriess }); 
    } catch (error) {
        res.status(400).json({
            status:'error',
            message:error.message
        })
    }    
}
exports.Createcategories=async (req,res) => {
    try {
        console.log(req.users.role)
        if (req.users.role !== 'admin')
        {
                return res.status(400).json({
                    status:'error',
                    message:'Forbidden"s'
                })
        }
        const catrgory=await categories.create(req.body)
        res.status(200).json({
            status:'success',
            catrgory
        })
    } catch (err) {
            res.status(400).json({
                status:'error',
                message:err.message
            })
    }
    
}
exports.Attributes=async (req,res) => {
    try {
        // const {name,value}=req.body
        const attributes=await Attributes.create(req.body) 
        
    const result = await Attributes.findByPk(attributes.attr_id);
     res.status(201).json({ status: "success",attributes});
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }


}
exports.GetAttributes=async (req,res) => {
    try {
        const attribute=await Attributes.findAll()
        res.status(200).json({
            status:'success',
            attribute
        })
    } catch (error) {
        res.status(400).json({
            status:'error',
            message:error.message
        })   
    }  
}