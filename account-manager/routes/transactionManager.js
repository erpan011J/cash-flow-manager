const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { processTransaction, checkBalance } = require('../utils/transactionUtils');
const { validateSession } = require('../utils/sessionUtils');

module.exports = async function (fastify, options) {
    fastify.post('/send', { preHandler: validateSession }, async (request, reply) => {
        try {
            const { accountId, amount, recipient, currency } = request.body;
            const userId = request.userId;
    
            // Check if the user has sufficient balance
            await checkBalance(userId, accountId, amount);
    
            // Process the transaction before creating payment history
            let transaction = { amount: accountId, currency: currency };
            await processTransaction(transaction);
    
            // Update payment account
            const updatedAccount = await prisma.paymentAccount.update({
                where: {
                    id: accountId,
                    userId: userId
                },
                data: {
                    balance: {
                        decrement: amount
                    }
                }
            });
            
            // Create payment history
            const createdHistory = await prisma.paymentHistory.create({
                data: {
                    accountId: accountId,
                    amount: amount,
                    recipient: recipient,
                    timestamp: new Date(),
                    transactionType: 'withdraw',
                    currency: currency,
                    userId: userId
                },
            });
            
            reply.code(200).send({ message: 'Transaction sent successfully', transaction: createdHistory });
        } catch (error) {
            reply.code(500).send({ error: error.message || 'Internal server error' });
        }
    });

    fastify.post('/withdraw', { preHandler: validateSession }, async (request, reply) => {
        try {
            const { accountId, amount, recipient, currency } = request.body;
            const userId = request.userId;
            
            // Check if the user has sufficient balance
            await checkBalance(userId, accountId, amount);

            // Process the transaction before creating payment history
            let transaction = { amount: accountId, currency: currency };
            await processTransaction(transaction);

            // Update payment account
            const updatedAccount = await prisma.paymentAccount.update({
                where: {
                    id: accountId,
                    userId: userId
                },
                data: {
                    balance: {
                        // Subtract the withdrawn amount from the current balance
                        decrement: amount
                    }
                }
            });

            // Create payment history
            const createdHistory = await prisma.paymentHistory.create({
                data: {
                    accountId: accountId,
                    amount: amount,
                    recipient: recipient,
                    timestamp: new Date(),
                    transactionType: 'withdraw',
                    currency: currency,
                    userId: userId
                },
            });

            reply.code(200).send({ message: 'Withdrawal successful', transaction: createdHistory });
        } catch (error) {
            reply.code(500).send({ error: error.message || 'Internal server error' });
        }
    });
};
