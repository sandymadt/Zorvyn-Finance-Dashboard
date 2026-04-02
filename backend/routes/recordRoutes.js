const express = require('express');
const router = express.Router();
const { 
    getRecords, 
    getRecord, 
    createRecord, 
    updateRecord, 
    deleteRecord 
} = require('../controllers/recordController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All record routes are protected by auth
router.use(protect);

// CRUD operations
router.route('/')
    .get(getRecords)
    .post(authorize('admin'), createRecord);

router.route('/:id')
    .get(getRecord)
    .put(authorize('admin'), updateRecord)
    .delete(authorize('admin'), deleteRecord);

module.exports = router;
