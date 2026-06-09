const Donation = require('../models/donations')
const axios = require('axios')

/**
 * Persists a new donation with status pending.
 * @param {number} amount 
 * @param {string} userId 
 * @returns {Promise<any>}
 */
const createDonation = async (amount, userId) => {
    return await Donation.create({
        amount,
        user: userId,
        status: 'pending'
    })
}

/**
 * Updates a donation by id and returns the updated document.
 * @param {string} id 
 * @param {object} data 
 * @returns {Promise<any>}
 */
const updateDonation = async (id, data) => {
    return await Donation.findByIdAndUpdate(id, data, { new: true })
}

/**
 * Calls the Kashier Payment Sessions API and returns the parsed response.
 * @param {object} donation 
 * @returns {Promise<any>}
 */
const createPaymentLink = async (donation, user) => {
    const webhookUrl = new URL(process.env.KASHIER_WEBHOOK_URL)
    const merchantRedirect = `${webhookUrl.protocol}//${webhookUrl.host}/donations/success`

    const payload = {
        merchantId: process.env.KASHIER_MERCHANT_ID,
        amount: donation.amount.toString(),
        currency: 'EGP',
        customer: {
            firstName: user.name.split(' ')[0],
            lastName: user.name.split(' ').slice(1).join(' ') || 'Donor',
            email: user.email,
            mobile: '01000000000',
            reference: user._id.toString()
        },
        order: donation._id.toString(),
        type: 'one-time',
        paymentType: 'one-time',
        allowedMethods: 'card,wallet',
        enable3DS: true,
        serverWebhook: process.env.KASHIER_WEBHOOK_URL,
        merchantRedirect: merchantRedirect
    }

    let response;
    try {
        response = await axios.post(
            'https://test-api.kashier.io/v3/payment/sessions',
            payload,
            {
                headers: {
                    'Authorization': process.env.KASHIER_SECRET_KEY,
                    'api-key': process.env.KASHIER_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        )
    } catch (err) {
        if (err.response && err.response.data) {
            console.error('Kashier API Error:', err.response.data);
            throw new Error(`Kashier Error: ${JSON.stringify(err.response.data)}`);
        }
        throw err;
    }

    return response.data
}

const listMyDonations = async (userId) => {
    return await Donation.find({ user: userId }).sort({ createdAt: -1 })
}

const listAllDonations = async () => {
    return await Donation.find().populate('user', 'name email')
}

module.exports = {
    createDonation,
    updateDonation,
    createPaymentLink,
    listMyDonations,
    listAllDonations
}
