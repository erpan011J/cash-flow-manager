const { validateSession } = require('../utils/sessionUtils');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function (fastify, options) {
    // Create a new payment account
    fastify.post('/payment-accounts', { preHandler: validateSession }, async (request, reply) => {
        try {
            const userId = request.userId;

            // Create a new payment account for the authenticated user
            const { accountType, balance } = request.body;
            const paymentAccount = await prisma.paymentAccount.create({
                data: {
                    accountType: accountType,
                    balance: balance,
                    userId: userId,
                },
            });

            // Return the created payment account
            reply.code(201).send({ paymentAccount });
        } catch (error) {
            reply.code(500).send({ error: 'Error creating payment account: ' + error.message });
        }
    });

    // Get all payment accounts associated with the authenticated user
    fastify.get('/payment-accounts', { preHandler: validateSession }, async (request, reply) => {
        try {
            const userId = request.userId;
            const paymentAccounts = await prisma.paymentAccount.findMany({
                where: {
                    userId: userId,
                },
            });

            reply.code(200).send({ paymentAccounts });
        } catch (error) {
            reply.code(500).send({ error: 'Error retrieving payment accounts: ' + error.message });
        }
    });

    // Get a specific payment account by ID
    fastify.get('/payment-accounts/:id', { preHandler: validateSession }, async (request, reply) => {
        try {
            const { id } = request.params;

            const paymentAccount = await prisma.paymentAccount.findUnique({
                where: {
                    id: parseInt(id),
                },
            });

            // Return the payment account
            reply.code(200).send({ paymentAccount });
        } catch (error) {
            reply.code(500).send({ error: 'Error retrieving payment account: ' + error.message });
        }
    });

    // Top-up a payment account by ID
    fastify.put('/payment-accounts/:id/topup', { preHandler: validateSession }, async (request, reply) => {
        try {
            const { id } = request.params;
            const { amount } = request.body;

            // Retrieve the current balance of the payment account
            const paymentAccount = await prisma.paymentAccount.findUnique({
                where: {
                    id: parseInt(id),
                },
            });

            if (!paymentAccount) {
                return reply.code(404).send({ error: 'Payment account not found' });
            }

            // Calculate the new balance by summing up the current balance and the top-up amount
            const newBalance = paymentAccount.balance + amount;

            // Update the payment account's balance with the new value
            const updatedPaymentAccount = await prisma.paymentAccount.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    balance: newBalance,
                },
            });

            // Return the updated payment account
            reply.code(200).send({ updatedPaymentAccount });
        } catch (error) {
            reply.code(500).send({ error: 'Error topping up payment account: ' + error.message });
        }
    });


    // Delete a payment account by ID
    fastify.delete('/payment-accounts/:id', { preHandler: validateSession }, async (request, reply) => {
        try {
            const { id } = request.params;

            // Delete the payment account by ID
            await prisma.paymentAccount.delete({
                where: {
                    id: parseInt(id),
                },
            });

            reply.code(200).send({ message: 'Payment account deleted successfully' });
        } catch (error) {
            reply.code(500).send({ error: 'Error deleting payment account: ' + error.message });
        }
    });
};
