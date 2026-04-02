const express = require('express');
const router = express.Router();
const { getDashboardSummary } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Dashboard routes protected by auth and restricted to Analyst/Admin roles
router.use(protect);
router.use(authorize('analyst', 'admin'));

router.get('/summary', getDashboardSummary);

module.exports = router;
