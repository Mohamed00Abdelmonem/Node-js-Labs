const express = require('express')
const router = express.Router()
const donationController = require('../controllers/donationController')
const { validateKashierHash, validateToken, validator, restrictTo } = require('../middlewares')
const createDonationSchema = require('../validators/createDonationSchema')

const authorizeTo = restrictTo

// GET /donations/all (restricted to admin)
router.get('/all', validateToken, authorizeTo('admin'), donationController.listAllDonations)

// GET /donations (authenticated)
router.get('/', validateToken, donationController.listMyDonations)

// POST /donations (authenticated, validated)
router.post('/', validateToken, validator(createDonationSchema), donationController.createDonation)

// POST /donations/webhook (signature validated)
router.post('/webhook', validateKashierHash, donationController.handleWebhook)

module.exports = router
