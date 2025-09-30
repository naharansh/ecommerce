const Vendors = require('../schema/vendors.js')
const utils=require('util')
const jsonWebToken=require('jsonwebtoken')
exports.Createvender = async (req, res) => {
   try {
      console.log(req.body)
      if (!req.body) {
         return res.status(559).json({
            status: 'error',
            message: 'some error has been occured'
         })
      }
      const user = await Vendors.create(req.body);
      res.status(201).json({
         status: 'success',
         user
      })

   }
   catch (err) {
      console.log(err)
      return res.status(559).json({
         status: 'error',
         message: err.message
      })
   }
}
exports.getVendors = async (req, res) => {
   try {
       const page=req.query.page||1
       const limit=req.query.limit||20;
       const search=req.query.search||''
       const status=req.query.status||null
       const offset=(page-1)*limit
       const where={}
       if (search) {
           where.vender_name = { [Op.iLike]: `%${search}%` };          
       }
       if(status)
       {
         where.status=status
       }
      const { rows, count } = await Vendors.findAndCountAll({
         where,
         include: [
            {
               model: User,
               attributes: ["user_name", "email"]
            }
         ],
         offset,
         limit,
         order: [["createdAt", "DESC"]],
      });


   }
   catch (err) {
      res.status(500).json({
         status: 'error',
         message: err.message
      })
   }

}
exports.protected=async (req,res,next) => {
     try {
        // 1. Get token from cookie
        const token = req.cookies?.token;
        console.log(token)
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Token is missing'
            });
        }

        // 2. Verify token
        const decoded = await utils.promisify(jsonWebToken.verify)(token, process.env.JWT_SECRET);
        console.log(decoded)
        // 3. Find user by decoded key
      
        // 4. Attach user to request object
        req.users = decoded
        console.log(req.users)

        next();
    } catch (error) {
        console.error(error);
        res.status(403).json({ status: 'error', message: 'Invalid token' });
    } 
}
exports.vendorDetails=async (req,res) => {
try
{
   console.log(req.users)
      const ids=req.params.ids
 
   let result=await Vendors.findByPk(ids)
   result=result.toJSON()
   res.status(200).json({
      status:'success',
      result
   })
   
}catch(err)
{
   res.status(500).json({
      status:'error',
      error:err.message
   })
}
}
exports.authorizeVendorOrAdmin=async(req,res,next)=>{
   const {role,user_id}=req.users;
  const { vendorId } = req.params;  
if (role === "admin") {
    return next(); // admins can always update
  }

  // check if this vendor belongs to the logged-in user
  Vendors.findOne({ where: { vender_id: vendorId, user_id } })
    .then(vendor => {
      if (!vendor) {
        return res.status(403).json({ status: "error", message: "Not authorized" });
      }
      next();
    })
    .catch(err => res.status(500).json({ status: "error", message: err.message }));
}
exports.updateVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const [updated] = await Vendors.update(req.body, {
      where: { vender_id: vendorId },
      returning: true
    });

    if (!updated) {
      return res.status(404).json({ status: "error", message: "Vendor not found" });
    }

    const updatedVendor = await Vendors.findByPk(vendorId);

    res.json({
      status: "success",
      message: "Vendor updated successfully",
      vendor: updatedVendor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};