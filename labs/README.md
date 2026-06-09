# Lab 3 - lab5: Donation API Integration

This is an Express API that includes user authentication and a donation system integrated with Kashier payment gateway, complete with transactional email receipts.

## Prerequisites
- Node.js installed
- MongoDB installed and running locally on port 27017
- [Ngrok](https://ngrok.com/) installed (for exposing local webhooks)

## Local Setup

### 1. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Environment Variables
Copy the example environment file to create your own `.env` file:
```bash
cp .env.example .env
```
Fill in the `.env` file with your credentials:
- Database (`mongoDBURL` should be your local mongo connection string, e.g., `mongodb://localhost:27017/mydb`)
- JWT settings
- Email credentials (for Nodemailer)
- Kashier merchant API keys

### 3. Exposing Webhooks with Ngrok
Since Kashier needs to send server-to-server webhook requests to your local environment, you need to expose your local server using Ngrok:
```bash
ngrok http 3000
```
Once Ngrok is running, copy the forwarding `https` URL (e.g., `https://<your-subdomain>.ngrok-free.app`). 

Update the `KASHIER_WEBHOOK_URL` in your `.env` file to append `/donations/webhook`:
```
KASHIER_WEBHOOK_URL=https://<your-subdomain>.ngrok-free.app/donations/webhook
```

### 4. Running the Development Server
Start the development server using nodemon:
```bash
npm run dev
```

The server should now be running locally on `http://localhost:3000` and accepting Kashier webhooks via your Ngrok tunnel.
