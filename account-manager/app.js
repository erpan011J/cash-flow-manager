const fastify = require('fastify')();

// Import route handlers
const authRoutes = require('./routes/auth');
const paymentAccountRoutes = require('./routes/paymentAccount');
const paymentHistoryManagerRoutes = require('./routes/paymentHistory');
const transactionManagerRoutes = require('./routes/transactionManager');

// Register routes
fastify.register(authRoutes);
fastify.register(paymentAccountRoutes);
fastify.register(paymentHistoryManagerRoutes);
fastify.register(transactionManagerRoutes);

// Start the Fastify server
fastify.listen(3000, '0.0.0.0', error => {
    if (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
    console.log('Server is running on port 3000');
});
