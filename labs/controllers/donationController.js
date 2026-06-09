const donationService = require('../services/donationService')
const emailService = require('../services/emailService')
const Donation = require('../models/donations')

/**
 * Creates a pending donation, calls Kashier payment session, updates donation with session info, and responds.
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.createDonation = async (req, res, next) => {
    const { amount } = req.body
    const userId = req.user.id || req.user._id

    // 1. Create pending donation
    const donation = await donationService.createDonation(amount, userId)

    // 2. Request payment link from Kashier
    const sessionData = await donationService.createPaymentLink(donation, req.user)

    // 3. Extract and save providerSessionId and payment link
    const body = sessionData.body || sessionData
    const providerSessionId = body._id || body.sessionId || body.id
    const sessionUrl = body.sessionUrl

    const updatedDonation = await donationService.updateDonation(donation._id, {
        providerSessionId,
        link: sessionUrl
    })

    // 4. Respond 200 with updated donation document
    res.status(200).json(updatedDonation)
}

/**
 * Handle incoming webhook payments from Kashier to update donation status.
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.handleWebhook = async (req, res, next) => {
    const data = req.body.data
    const { merchantOrderId, status } = data

    // Map SUCCESS to completed, anything else to failed
    const mappedStatus = status === 'SUCCESS' ? 'completed' : 'failed'

    // Update the donation
    await donationService.updateDonation(merchantOrderId, {
        status: mappedStatus
    })

    // Fetch the updated donation with user populated
    const donation = await Donation.findById(merchantOrderId).populate('user')
    console.log(donation, mappedStatus)
    // Send thank-you email if payment succeeded
    if (donation && mappedStatus === 'completed') {
        await emailService.sendEmail(
            'donationSuccess',
            {
                name: donation.user.name,
                amount: donation.amount,
                donationId: donation._id.toString()
            },
            donation.user.email,
            'Thank you for your donation!'
        )
    }

    // Respond 200 with acknowledgment
    res.status(200).json({
        status: 'success',
        message: 'Webhook processed successfully',
        donationId: merchantOrderId
    })
}

/**
 * Returns the current user's donations, sorted by newest first.
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.listMyDonations = async (req, res, next) => {
    const userId = req.user.id || req.user._id
    const donations = await donationService.listMyDonations(userId)
    res.status(200).json({
        status: 'success',
        data: donations
    })
}

/**
 * Returns all donations in the system with donor's name and email populated.
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.listAllDonations = async (req, res, next) => {
    const donations = await donationService.listAllDonations()
    res.status(200).json({
        status: 'success',
        data: donations
    })
}
