// const { version } = require("react")

exports.SimpleHealth=async (req,res) => {
    try {
        res.status(200).json({
            status:'success',
            message:'API is Healthy',
            uptime:process.uptime(),
            timeStamp:new Date().toISOString(),
            version:process.env.npm_package_version

        })
    } catch (err) {
        return res.status(400).json({
            status:'error',
            message:err.message
        })        
    }    
}