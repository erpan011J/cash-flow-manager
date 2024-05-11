const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { validateSession } = require('../utils/sessionUtils');

module.exports = async function (fastify, options) {
    fastify.get('/transactions/:accountId', { preHandler: validateSession }, async (request, reply) => {
        try {
            const { accountId } = request.params;
            const userId = request.userId;
            const transactions = await prisma.paymentHistory.findMany({
                where: {
                    accountId: parseInt(accountId),
                    userId: userId
                },
            });
            reply.code(200).send({ transactions });
        } catch (error) {
            reply.code(500).send({ error: error.message || 'Internal server error' });
        }
    });
};
