const Record = require('../models/Record');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private (Analyst & Admin)
const getDashboardSummary = async (req, res) => {
    try {
        // Aggregate totals
        const stats = await Record.aggregate([
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const summary = {
            totalIncome: 0,
            totalExpenses: 0,
            netBalance: 0
        };

        stats.forEach(stat => {
            if (stat._id === 'income') {
                summary.totalIncome = stat.total;
            } else if (stat._id === 'expense') {
                summary.totalExpenses = stat.total;
            }
        });

        summary.netBalance = summary.totalIncome - summary.totalExpenses;

        // Breakdown by category
        const categoryBreakdown = await Record.aggregate([
            {
                $group: {
                    _id: { type: '$type', category: '$category' },
                    total: { $sum: '$amount' }
                }
            },
            {
                $sort: { total: -1 }
            }
        ]);

        // Recent activities (last 5)
        const recentRecords = await Record.find()
            .sort({ date: -1 })
            .limit(5)
            .populate('createdBy', 'name email');

        res.json({
            success: true,
            summary,
            categoryBreakdown,
            recentRecords
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getDashboardSummary
};
