const Cartone = require('../schema/cart')
const sks = require('../schema/SKU')
const CartItem = require('../schema/cartItems');
const User = require('../schema/users');
const coupons = require('../schema/coupons');
const Sks = require('../schema/SKU');
const { Attributes } = require('./categories');
// Add item to cart
exports.addItem = async (req, res) => {
  try {
    // console.log("Dfsfsd")
    const { sku, quantity } = req.body
    // console.log(req.users)
    const user_id = req.users.user_id;
    let carts = await Cartone.findOne({ where: { user_id } })
    //  console.log(carts)
    if (!carts) {
      console.log("DFS")
      carts = await Cartone.create({ user_id })
      console.log(carts)
    }
    const products = await sks.findByPk(sku)
    console.log(products.toJSON())
    if (!products) return res.status(404).json({ message: "Product not found" });
    if (quantity > products.stock) {
      return res.status(400).json({ message: "Not enough stock" })
    };
    let cartItem = await CartItem.findOne({ where: { cart_id: carts.cart_id, sku_id: sku } });
    console.log(cartItem)
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({ cart_id: carts.cart_id, sku_id: sku, quantity });
    }
    const updatedCart = await CartItem.findOne({
      where: { cart_id: carts.cart_id },
      include: [{ model: Cartone, as: "cid", }],
    });
    console.log(cartItem)
    res.json(updatedCart);
  } catch (error) {
    console.log(error)
  }
};
exports.GetCart = async (req, res) => {
  try {
    const users = req.users.user_id
    console.log(users)
    const cart = await Cartone.findOne({
      where: { user_id: users },
      include: [{
        model: User,
        as: 'user'
      }]
    })
    res.status(200).json({
      status: 'success',
      cart
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    })
  }

}
exports.UpdateCart = async (req, res) => {
  try {
    const { itemId } = req.params
    const { quantity } = req.body
    let result = await CartItem.findByPk(itemId)
    if (!result) {
      return res.status(400).json({
        status: 'error',
        message: 'id does not find the product'
      })

    }
    result.quantity = quantity
    await result.save()
    res.status(200).json({
      status: 'success',
      result
    })

  } catch (error) {

  }
}
exports.PostCoupean = async (req, res) => {
  try {
    const { code, descriptiion, discount_type, discount_value, usage_limit, per_user_limit, conditions } = req.body
    const result = await coupons.create({ code, descriptiion, discount_type, discount_value, usage_limit, per_user_limit, conditions })
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
exports.ApplyCoupean = async (req, res) => {
  try {
    const user_id = req.users.user_id
    const { code } = req.body
    let cart = await Cartone.findOne({ where: { user_id } })
    cart = cart.toJSON().cart_id

    const items = await CartItem.findOne({
      where: { cart_id: cart }, include: [
        {
          model: Sks,
          as: 'sid'
        }
      ]
    })

    if (!cart || items.length === 0) {
      return res.status(400).json({
        message: 'Cart is empty'
      })
    }

    let coupans = await coupons.findOne({ where: { code } })

    if (!coupans) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid Coupoens'
      })
    }
    const coupanss = coupans.toJSON();

    if (new Date(coupanss.updateAt) < new Date()) {
      res.status(400).json({
        status: 'error',
        message: 'coupans Expires'
      })
    }
    if (coupanss.usage_limit <= 0 && coupanss.per_user_limit <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'coupan limit expires'
      })

    }
    await coupans.update(
      {
        usage_limit: coupanss.usage_limit - 1,
        per_user_limit: coupanss.per_user_limit - 1,
      },
      { where: { id: coupanss.id } }
    );

    let discountprice = 0;
    if (coupanss.discount_type === 'percentage') {
      discountprice = (items.sid.sale_price * coupanss.discount_value) / 100;
    }
    else if (coupanss.discount_type === 'fixed') {
      discountprice = coupanss.discount_value
    }
    const total = items.sid.sale_price - discountprice
    items.sid.sale_price = total
    // await items.sid.save()
    const sku = await sks.findByPk(items.sid.id);
    sku.sale_price = total;
    await sku.save();
    return res.status(200).json({
      status: "success",
      message: "Coupon applied successfully",
      cart: {
        id: items.id,
        discount: discountprice,
        total: items.sid.sale_price,
        coupon: {
          code: coupanss.code,
          discount_type: coupanss.discount_type,
          discount_value: coupanss.discount_value,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    })
  }
}
exports.estimateCart = async (req, res) => {
  try {
    const userid = req.users.user_id;
    let cartItem = await Cartone.findOne({ where: { user_id: userid } })
    cartItem = cartItem.toJSON()

    if (!cartItem) {
      return res.status(400).json({
        status: 'error',
        message: 'cart is empty'
      })

    }
    console.log(cartItem)
    const items = await CartItem.findAll({
      where: { cart_id: cartItem.cart_id },
      include: [{
        model: sks, as: 'sid'
      }],


    })
    console.log(items.length)
    if (items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'cartItem is empty'
      })

    }
    let total = 0
    items.map((elements) => {
      total += elements.quantity * elements.sid.sale_price
    })
    let shipping = 0;
    if (total < 2000) {
      shipping = 0
    } else {
      shipping = 100
    }
    let tax = 0.18;
    const ftotal = shipping + tax + total;
   
    res.status(200).json({
      status: "success",
      data: {
        total,
        shipping,
        tax,
        ftotal,
        currency: "INR",
      },
    })
    // console.log(total)
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    })
  }

}
exports.DeleteItem=async (req,res) => {
  try {
    const ids=req.params
    const result=CartItem.destroy({where:{id:ids}})
    res.status(200).json({
      status:'success',
      result
    })

  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    })
  }
  
}