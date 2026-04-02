const Record = require('../models/Record');

// @desc    Get all records
// @route   GET /api/records
// @access  Private (all roles)
const getRecords = async (req, res) => {
    try {
        const { type, category, startDate, endDate, page = 1, limit = 10, search } = req.query;
        
        // Build query
        const query = {};

        // Filtering
        if (type) query.type = type;
        if (category) query.category = category;
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        // Search in notes
        if (search) {
            query.note = { $regex: search, $options: 'i' };
        }

        // Pagination
        const skip = (page - 1) * limit;

        const records = await Record.find(query)
            .sort({ date: -1 })
            .populate('createdBy', 'name email role')
            .skip(skip)
            .limit(Number(limit));

        const totalRecords = await Record.countDocuments(query);

        res.json({
            success: true,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            currentPage: Number(page),
            count: records.length,
            data: records
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single record
// @route   GET /api/records/:id
// @access  Private
const getRecord = async (req, res) => {
    try {
        const record = await Record.findById(req.params.id).populate('createdBy', 'name email role');

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Record not found'
            });
        }

        res.json({
            success: true,
            data: record
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new record
// @route   POST /api/records
// @access  Private (Admin Only)
const createRecord = async (req, res) => {
    try {
        // Double check admin role although middleware should handle it
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required to create records'
            });
        }

        const { amount, type, category, date, note } = req.body;

        const record = await Record.create({
            amount,
            type,
            category,
            date,
            note,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            data: record
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update record
// @route   PUT /api/records/:id
// @access  Private (Admin Only)
const updateRecord = async (req, res) => {
    try {
        let record = await Record.findById(req.params.id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Record not found'
            });
        }

        record = await Record.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            data: record
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete record
// @route   DELETE /api/records/:id
// @access  Private (Admin Only)
const deleteRecord = async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Record not found'
            });
        }

        await record.deleteOne();

        res.json({
            success: true,
            message: 'Record removed'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getRecords,
    getRecord,
    createRecord,
    updateRecord,
    deleteRecord
};
