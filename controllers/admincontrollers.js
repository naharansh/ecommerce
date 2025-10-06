// const { where } = require('sequelize')
const { Op, Sequelize } = require('sequelize')
const User = require('../schema/users.js')
const Vendors = require('../schema/vendors.js')
const Order = require('../schema/Order.js')
const Refund = require('../schema/refunds.js')
const Products = require('../schema/product.js')
exports.ManageUsers = async (req, res) => {
    try {
        if (req.users.role !== 'admin') {
            return res.status(400).json({
                status: 'error',
                message: 'unauthorized'
            })

        }
        const result = await User.findAll({
            raw: true
        })
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
exports.UpdateRoles = async (req, res) => {
    try {
        console.log("DF")
        const { id } = req.params
        const { role } = req.body
        const roles = ['customer', 'vendor_staff', 'vendor_owner', 'admin']
        if (!roles.includes(role)) {
            return res.status(400).json({
                status: 'error',
                message: 'role is invalid'
            })
        }
        const result = User.update({ role: role }, { where: { user_id: id } })
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
exports.ManageVendores = async (req, res) => {
    try {
        if (req.users.role !== 'admin') {
            return res.status(400).json({
                status: 'error',
                message: 'Unauthorized'
            })
        }
        const result = await Vendors.findAll({
            include: [
                {
                    model: User,
                    as: 'user'

                }
            ]

        })
        console.log(result)
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
exports.Sales = async (req, res) => {
    try {
        const { from, to, vendorId, group = 'day', status } = req.query
        const where = {}
        if (from || to) {
            where.vendor_id = vendorId
        }
        if (from) {
            where.created_at[Op.gte] = new Date(from)

        }
        if (to) {
            where.created_at[Op.lte] = new Date(to);
        }
        if (status) {
            where.status = status
        }
        const salesData = await Order.findAll({
            where,
            attributes: [[Sequelize.fn('COUNT', Sequelize.col('order_id')), 'total_orders'],
            [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'total_revenue'],
            [Sequelize.fn('DATE_TRUNC', groupBy, Sequelize.col('created_at')), 'period']
            ]
        })
        const refundData = await Refund.findAll({
            where: from || to ? { created_at: { [Op.between]: [from, to] } } : {},
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('amount')), 'refund_amount'],
                [Sequelize.fn('COUNT', Sequelize.col('refund_id')), 'refund_count']
            ],
            raw: true
        });
        const total_orders = salesData.reduce((a, r) => a + parseInt(r.dataValues.total_orders || 0), 0);
        const total_revenue = salesData.reduce((a, r) => a + parseFloat(r.dataValues.total_revenue || 0), 0);
        const total_refunds = refundData[0]?.refund_count || 0;
        const total_refund_amount = parseFloat(refundData[0]?.refund_amount || 0);
        res.json({
            summary: {
                total_orders,
                total_revenue,
                total_refunds,
                total_refund_amount,

            },
        })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
exports.Orders = async (req, res) => {
    try {
        const { from, to, vendorId, user_id, status, search } = req.query
        const where = {}
        if (from || to) {
            where.created_at = {

            }
        }
        if (from) {
            where.created_at[Op.gte] = new Date(from)

        }
        if (to) {
            where.created_at[Op.lte] = new Date(to);
        }
        if (status) {
            where.status = status
        }
        if (search) {
            where[Op.or] = [
                { order_number: { [Op.iLike]: `%${search}%` } },
                  { '$user_name$': { [Op.iLike]: `%${search}%` } },
                    { '$order_number$': { [Op.iLike]: `%${search}%` } }
            ]
        }
        if (user_id) {
                where.user_id=user_id
        }
        if(vendorId)
        {
            where.vendorId=vendorId
        }
         const orders = await Order.findAndCountAll({
      where,
      include: [
        { model: User, as: 'uid', attributes: ['user_id', 'name', 'email'] },
        { model: Vendors, as: 'vid', attributes: ['vendor_id', 'name'] }
      ],
    })
     res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total: orders.count,
      orders: orders.rows
    });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }

}
exports.Search=async (req,res) => {
    try {
        const { q, category, priceMin, priceMax, page = 1, limit = 20, sort, order = 'asc', ...filters } = req.query;
        const where={}
        if(category)
        {
                where.category_slug = category;
        }
        if(priceMax || priceMin)
        {
            where.price={}
            if (priceMin) where.price[Op.gte] = parseFloat(priceMin);
      if (priceMax) where.price[Op.lte] = parseFloat(priceMax);
        }
         for (const key in filters) {
      if (key.startsWith('attributes[')) {
        const attrName = key.slice(11, -1);
        where[`attributes.${attrName}`] = filters[key];
      }
    }
    const offset = (page - 1) * limit;

    let searchCondition = {};
    if (q) {
      searchCondition = Sequelize.literal(`
        search_vector @@ plainto_tsquery('simple', '${q}')
      `);
    }
    const categoryFacets = await Products.findAll({
      attributes: [
        'category_slug',
        [Sequelize.fn('COUNT', Sequelize.col('product_id')), 'count']
      ],
    })
     res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total: products.count,
      facets: {
        categories: categoryFacets.map(c => ({
          name: c.dataValues.category_slug,
          count: parseInt(c.dataValues.count)
        })),
    }
    })
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }    
}