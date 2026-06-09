const express = require('express')
const router = express.Router()
const donationController = require('../controllers/donationController')
const { validateKashierHash, validateToken, validator, restrictTo } = require('../middlewares')
const createDonationSchema = require('../validators/createDonationSchema')

const authorizeTo = restrictTo

// GET /donations/all (restricted to admin)
router.get('/all', validateToken, authorizeTo('admin'), donationController.listAllDonations)

// GET /donations/success (public redirect from Kashier)
router.get('/success', (req, res) => {
    res.send('<h1 style="font-family: sans-serif; text-align: center; margin-top: 50px; color: #4CAF50;">Payment Processed! Please check your email for the receipt.</h1>');
})

// GET /donations (authenticated)
router.get('/', validateToken, donationController.listMyDonations)

// POST /donations (authenticated, validated)
router.post('/', validateToken, validator(createDonationSchema), donationController.createDonation)

// POST /donations/webhook (signature validated)
router.post('/webhook', validateKashierHash, donationController.handleWebhook)

module.exports = router
