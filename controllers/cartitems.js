const Cart=require('../schema/cart')
const CartItem=require('../schema/cartItems')
exports.addItem=async (req,res) => {
    const user_id=req.users.user_id
    const {sku_id,quantity,metadata}=req.body
    if (!sku_id || !quantity || quantity<1) {
            return res.status(400).json({
                status:'error',
                message:'Invalid sku_id aand quantity'
            })  
    }
    let cart =await  Cart.findOne({where:{"user_id":user_id}});
    if (!cart) {
        cart=await Cart.create({user_id:user_id})        
    }
    if (!cart || !cart.cart_id) {
  return res.status(500).json({ status: "error", message: "Cart creation failed" });
}
    let carditem=await CartItem.findOne({where:{"cart_id":cart.cart_id, sku_id}})
    if (carditem) {
            carditem.quantity=carditem+quantity;       
            carditem.metadata={...carditem.metadata,...metadata}
            await carditem.save()
    }
    else
    {
        CartItem=await CartItem.create({
            cart_id:cart.cart_id,
            sku_id,
            quantity,
            metadata
        })
    }
    const updateCart=await Cart.findOne({
        where:{cart_id:cart.cart_id},
        include: {
        model: CartItem,
        as: "items",
        include: { model: Product, as: "product", attributes: ["sku_id", "name", "unit_price"] }
      }
    })
const total = updateCart.items.reduce((sum, item) => {
      return sum + item.quantity * parseFloat(item.product.unit_price);
    }, 0);

    res.status(200).json({
      status: "success",
      data: { ...updateCart.toJSON(), total }
    });

}