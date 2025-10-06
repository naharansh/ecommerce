// const { sequelize } = require('sequelize');
const sequelize = require('../config/db.js')
const Cart = require('../schema/cart.js');
const payment = require('../schema/Payments.js')
const stripe = require('stripe')
const Stripe = new stripe(process.env.Secret_key)
const CartOne = require('../schema/cart.js');
const CartItems = require('../schema/cartItems.js');
const Sks = require('../schema/SKU.js');
const Order = require('../schema/Order.js')
const OrderItems = require('../schema/Order_item.js');
const Shops = require('../schema/vendors.js');
const User = require('../schema/users.js');
const datas = require('../schema/shipments.js');
const { Op } = require('sequelize');
const refund=require('../schema/refunds.js')
const Payment = require('../schema/Payments.js');
// const { json } = require('sequelize');

exports.OrderItems = async (req, res) => {
    try {
        const t = await sequelize.transaction();
        console.log("Dsfd")
        const userid = req.users.user_id;
        const { order_number, shipping_address, billing_address, payment_address, vendor_id, payment_method_id } = req.body

        let cartdata = await CartOne.findOne({ where: { user_id: userid } })
        cartdata = cartdata.toJSON()

        let cartitem = await CartItems.findAll({ where: { cart_id: cartdata.cart_id }, include: [{ model: Sks, as: 'sid' }, { model: Cart, as: 'cid' }] })

        if (cartitem.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'cart item is not found'
            })
        }

        let subtotal = 0
        for (const item of cartitem) {


            if (item.sid.stock < item.quantity) {
                return res.status(400).json({
                    status: 'error',
                    message: 'some errro has occur'
                })

            }

            item.sid.stock -= item.quantity
            await item.sid.save({ transaction: t })
            subtotal += item.quantity * item.sid.price

        }
        const order = await Order.create({
            order_number,
            status: 'pending',
            total_amount: subtotal,
            shipping_address,
            billing_address,
            payment_Address: payment_address,
            user_id: userid,
            vendor_id: vendor_id
        }, { transaction: t })
        for (const items of cartitem) {
            await OrderItems.create({
                unitPrice: items.sid.price,
                subtotal,
                quantity: items.quantity,
                Vendor_id: vendor_id,
                Order_id: order.order_id
            }, {
                transaction: t
            })
        }
        const paymentIntent = await Stripe.paymentIntents.create({
            amount: Math.round(subtotal * 100),
            currency: 'inr',
            payment_method: payment_method_id,
            confirmation_method: 'manual',
            confirm: false,
            metadata: { order_id: order.order_id, user_id: userid },
        })

        await payment.create({
            gateway: 'razorpay',                       // ✅ required

            order_id: order.order_id,
            gateway_payment_id: paymentIntent.id,
            amount: subtotal,
            raw_response: { curr: 'inr' },
            status: 'initiated',
            gatway: 'stripe'
        }, { transaction: t });

        await t.commit();

        res.status(201).json({
            order,
            payment_intent: { client_secret: paymentIntent.client_secret },
        });


    } catch (error) {
        console.log(error)
    }
}
exports.GetItems = async (req, res) => {
    try {
        const users = req.users
        const { status, vendor_id, startDate, endDate } = req.query
        const where = {}
        if (users.role === 'user') {
            where.user_id = users.user_id
        }
        else if (users.role === 'vendor') {
            where.vendor_id = vendor_id
        }
        else if (users.role === 'admin') {
            where.vender_id = vendor_id
        }
        if (status) {
            where.status = status
        }
        if (startDate || endDate) {
            where.created_at = {};
            if (startDate) { where.created_at[Op.gte] = new Date(startDate) };
            if (endDate) { where.created_at[Op.lte] = new Date(endDate) };
        }
        const orders = await Order.findAll({
            where: where,
            include: [{
                model: User,
                as: 'uid'
            }, {
                model: Shops,
                as: 'vid'
            }]

        })
        res.status(200).json({
            status: 'success',
            orders
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: 'error',
            err: error.message
        })
    }

}
exports.Details = async (req, res) => {
    try {
        const { order_item } = req.params
        console.log(order_item)
        const orders = await OrderItems.findOne({
            where: { id: order_item }, include: [{
                model: Shops,
                as: 'vid'
            }, { model: Order, as: 'oid' }]
        });
        const users = req.users
        console.log(orders.toJSON())
        if (!orders) {
            return res.status(400).json({
                status: 'error',
                message: 'Order Items are not found'
            })
        }
        const isOwerner = users.role === 'user' && users.user_id === orders.oid.user_id
        const isAdmin = users.role === 'admin'
        const isVendor = users.role === 'vendor' && orders.Vendor_id === orders.vid.vender_id
        if (!isAdmin && !isOwerner && !isVendor) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        res.status(200).json({
            status: 'success',
            orders
        });

    } catch (error) {
        console.error('Error fetching order detail:', error);
        res.status(500).json({ success: false, err: error.message });
    }

}
exports.Cancel = async (req, res) => {
    try {

        const user = req.users
        const { orderId } = req.params
        const t = await sequelize.transaction();
        const orderItem = await OrderItems.findOne({
            where: { id: orderId },
            include: [
                {
                    model: Order,
                    as: 'oid'
                }
            ],
            transaction: t,
        })
        console.log(orderItem.toJSON())
        const payments = await Payment.findOne({
            where: { order_id: orderItem.Order_id }
        });
        console.log(payments.toJSON())

        const isUser = user.role === 'user' && orderItem.user_id === user.user_id;
        const isAdmin = user.role === 'admin';
        const isVendor = user.role === 'Vendor' && orderItem.Vendor_id === orderItem.oid.vender_id
        if (!isAdmin && !isUser && isVendor) {
            await t.rollback();
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        if (!['shipped', 'delivered', 'cancelled'].includes(orderItem.oid.status)) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: `Cannot cancel order in '${orderItem.status.status}' status.`,
            });
        }

        orderItem.oid.status = 'cancelled',
            await orderItem.save({ transaction: t });
        res.status(200).json({
            status: 'success',
            message: 'Order cancelled successfully',
            orderItem,
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ success: false, err: error.message });
    }
}
exports.Shipments = async (req, res) => {
    try {
        const { orderId } = req.params
        const { trackingnumber, carrier, notes } = req.body
        const user = req.users
        const order = await Order.findByPk(orderId,{
            include: [
          
                {
                    model:Shops,
                    as: 'vid'
                },
                {
                    model:User,
                    as:'uid'
                }
            ]
        })
        console.log(order.toJSON())
          if (!order) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Order not found' });
    }       
        const isAdmin = user.role === 'admin';
        const isVendor = user.role === 'vendor' && order.vendor_id === order.vid.vender_id
        if (!isAdmin && !isVendor) {
            return res.status(403).json({ success: false, message: 'Not authorized to fulfill this order' });

        }
        if (!['paid', 'processing'].includes(order.status)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: `Order cannot be shipped in '${order.status}' status`
      });
    }
        const [shipment, created] = await datas.findOrCreate({
      where: { order_id: orderId },
      defaults: {
        order_id: orderId,
        trackingnumber: trackingnumber,
        carrier,
        status: 'shipped',
        notes,
      },
      transaction: t
    });   
       order.status = 'shipped';
    await order.save({ transaction: t });


    return res.status(200).json({
      success: true,
      message: 'Order marked as shipped successfully',
      shipment,
    });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
exports.Delevired = async (req, res) => {
    try {
        const { orderId } = req.params
        const { Delevired_at, notes } = req.body
        const usrs = req.users;
        const result = await datas.findOne({
            where: orderId, include: [{
                model: Order,
                as: 'oid'
            }]
        })
        const vendor = await Shops.findByPk(result.oid.Vendor_id)
        if (!result) {
            return res.status(404).json({
                status: "error",
                message: 'Order not found'
            })
        }
        const isAdmin = usrs.role === 'admin'
        const isVendor = usrs.role === 'vendor' && vendor === result.oid.Vendor_id
        if (!isAdmin && !isVendor) {
            return res.status(403).json({ success: false, message: 'You are not authorized to fulfill this order' });
        }
        if (!['shipped', 'out_for_delivery'].includes(result.status)) {
            return res.status(400).json({
                success: false,
                message: `Order cannot be marked as delivered from current status: ${result.status}`
            });
        }
        await result.update({
            status: 'delivered',
            delivered_at: Delevired_at || new Date(),
            delivery_notes: notes || null
        })
        res.status(200).json({
            success: true,
            message: 'Order marked as delivered successfully',
            result
        });
    } catch (error) {
        return res.status(500).json({ success: false, err: error.message });
    }
}
exports.Refund=async (req,res) => {
    const t = await sequelize.transaction();
    try {
            const {orderId}=req.params
            const {reason}=req.body
            const user=req.users;
            const orders=await OrderItems.findByPk(orderId,{
                include:[{
                    model:Shops,
                    as:'vid'
                }],
                transaction:t
            })
            if(!orders)
            {
                 await t.rollback();
      return res.status(404).json({ success: false, message: 'Order not found' });
            }
            const isAdmin=user.role ==='admin'
            const isVendor=user.role === 'vendor'
             if (!isAdmin && !isVendor) {
      await t.rollback();
      return res.status(403).json({ success: false, message: 'Not authorized to refund this order' });
    }
    const existing=await Payment.findOne({
        where:{order_id:orders.Order_id},
        transaction:t,
    })
    if (!existing || existingPayment.status !== 'succeeded') {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'No successful payment found for this order' });
    }
    const stripeRefund  = await Stripe.refunds.create({
      payment_intent: existingPayment.gateway_payment_id,
      reason: reason || 'requested_by_customer',
    });
    const refunds=await refund.create({
        payment_id:existing.pid,
        amount:existing.amount,
        reason:reason,
        status:'pending'
    })
    await existing.update({ status: 'refunded' }, { transaction: t })
    await orders.update({ status: 'refunded' }, { transaction: t });

    await t.commit();
    return res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      refunds,
    });
    } catch (error) {
         await t.rollback();
    console.error('Refund Error:', error);
    return res.status(500).json({ success: false, error: error.message });
    }    
}
