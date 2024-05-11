const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function processTransaction(transaction) {
    return new Promise((resolve, reject) => {
        console.log('Transaction processing started for:', transaction);

        // Simulate long running process
        setTimeout(() => {
            // After 3 seconds, we assume the transaction is processed successfully
            console.log('transaction processed for:', transaction);
            resolve(transaction);
        }, 3000); // 3 seconds
    });
}

async function checkBalance(userId, accountId, amount) {
    try {
        const account = await prisma.paymentAccount.findUnique({
            where: {
                id: accountId,
                userId: userId
            },
            select: {
                balance: true
            }
        });

        if (!account) {
            throw new Error('Account not found');
        }

        // Check if the account has sufficient balance
        if (account.balance < amount) {
            throw new Error('Insufficient balance');
        }

        return true;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { processTransaction, checkBalance };