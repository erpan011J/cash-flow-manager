const { supabase } = require('../supabaseClient');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function (fastify, options) {
    fastify.post('/signup', async (request, reply) => {
        const { email, password } = request.body;

        try {
            // Sign up user with Supabase
            const { user, session, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) {
                throw new Error(error || 'Failed to register user');
            }

            // Create user in Prisma
            const createdUser = await prisma.user.create({
                data: {
                    email: email
                }
            });
            reply.code(201).send({ user: createdUser, session });
        } catch (error) {
            reply.code(500).send({ error: error.message || 'Internal server error' });
        }
    });

    fastify.post('/login', async (request, reply) => {
        const { email, password } = request.body;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error || !data) {
                throw new Error(error || 'Failed to log in user');
            }

            reply.code(200).send({ session: data.session });
        } catch (error) {
            reply.code(500).send({ error: error.message || 'Internal server error' });
        }
    });

    fastify.post('/logout', async (request, reply) => {

        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                throw new Error(error || 'Failed to log out user');
            }

            reply.code(200).send('User logged out');
        } catch (error) {
            reply.code(500).send({ error: error.message || 'Internal server error' });
        }
    });
};
