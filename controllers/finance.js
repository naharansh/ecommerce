const { Op } = require("sequelize");
const Shops = require("../schema/vendors");
const Order = require("../schema/Order");
const datas = require("../schema/refunds");
const Payment = require("../schema/Payments");
const Legers = require("../schema/ledger");

exports.Admins = async (req, res) => {
    try {
        const { vendorId, from, to } = req.query
        if (!vendorId) {
            return res.status(400).json({ success: false, message: 'vendorId required' });

        }
        const datafilter = {}
        if (from && to) {
            datafilter.createdAt = { [Op.between]: [new Date(from), new Date(to)] }
        }
        else if (from) {
            datafilter.createdAt = { [Op.gte]: new Date(from) };
        }
        else if (to) {
            datafilter.createdAt = { [Op.lte]: new Date(to) }
        }
        const vendor = await Shops.findByPk(vendorId)
        if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
        const order = await Order.findAll({
            where: {
                vendor_id: vendor, status: ['delivered', 'refunded'],
                ...(Object.keys(datafilter).length && { where: { ...datafilter } })
            }
        })
        const payments = await Payment.findAll({
            where: { vendor_id: vendorId, ...dateFilter },
            include: [{ model: Refund, as: 'refunds' }]
        });

        let totalPayments = 0;
        let totalRefunds = 0;
        const breakdown = [];

        for (const pay of payments) {
            const payAmount = parseFloat(pay.amount);
            totalPayments += payAmount;

            let refundTotal = 0;
            if (pay.refunds && pay.refunds.length) {
                refundTotal = pay.refunds.reduce((acc, r) => acc + parseFloat(r.amount), 0);
            }
            totalRefunds += refundTotal;

            const commissionRate = vendor.commission_rate || 0.1;
            const commission = payAmount * commissionRate;
            const netVendor = payAmount - refundTotal - commission;

            breakdown.push({
                payment_id: pay.pid,
                amount: payAmount,
                refund_amount: refundTotal,
                commission,
                net_vendor: netVendor,
                created_at: pay.createdAt,
            });
        }

        const commissionRate = vendor.commission_rate || 0.1;
        const commissionAmount = totalPayments * commissionRate;
        const netPayable = totalPayments - totalRefunds - commissionAmount;

        res.status(200).json({
            success: true,
            vendor: { id: vendor.vendor_id, name: vendor.name },
            totals: {
                total_payments: totalPayments,
                total_refunds: totalRefunds,
                commission_rate: commissionRate,
                commission_amount: commissionAmount,
                net_payable: netPayable,
            },
            breakdown,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
exports.Initiate = async (req, res) => {
    try {
        const { Vendor_id } = req.parms
        const { amount, type, metadata } = req.body
        if (!req.users.user_id) {
            return res.status(400).json({
                status: 'error',
                json: {
                    status: 'forbidden'
                }
            })
        }
        const balence = await Legers.sum('amount', { where: { vendor: Vendor_id } })
        if (!balence || balence < amount) {
            return res.status(400).json({
                status: 'error',
                message: 'Insufficient balance for payout'
            })

        }
        const ledger = await LedgerEntry.create({
            vendor_id: Vendor_id,
            type: 'payout',
            amount: -amount,
            balence_after: balence,
            metadata
        }, { transaction: t });
        await t.commit();
        res.status(201).json({
            status: 'success',
            ledger
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
exports.Legers = async (req, res) => {
    try {
        const { vendorId } = req.parms
        const { from, to, type, limit = 50, offset = 0 } = req.query
        let where = { vendor_id: vendorId }
        if (from || to) {
            where.created_at = {};
        }
        if (from) {
            where.created_at[Op.gte] = new Date(from);

        }
        if (to) {
            where.created_at[Op.lte] = new Date(to)
        }
        if (type) {
            where.type = type
        }
        const entries = await Legers.findAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
        })
        const balence = await Legers.sum('amount', { where })
        res.json({
      vendorId,
      balance: balence || 0,
      currency: 'INR',
      entries,
    });
    } catch (error) {
         res.status(500).json({ message: 'Failed to fetch ledger' });

    }
}