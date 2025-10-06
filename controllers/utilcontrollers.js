    // const { version } = require("react")
exports.PaymentsConfig=async (req,res) => {
    console.log("dfsfs")
    const FRONTEND_CONFIG = {
  stripePublicKey: process.env.Publishable_key,
  supportedCurrencies: ["USD", "INR", "EUR"],
  paymentMethods: ["card", "upi"],
  environment: process.env.NODE_ENV || "development",
};
     try {
    res.status(200).json({
      success: true,
      data: FRONTEND_CONFIG,
    });
  } catch (error) {
    console.error("Config fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load configuration",
    });
  }
}
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