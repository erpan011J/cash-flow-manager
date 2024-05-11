const { supabase } = require('../supabaseClient');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Function to retrieve and validate session information
async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data) {
        throw new Error(error || 'Failed to retrieve session information');
    }

    return data;
}

async function getUserId(email) {
    try {
        // Query the user table to find the user ID by email
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user.id;
    } catch (error) {
        throw new Error('Failed to get user ID: ' + error.message);
    }
}

async function validateSession(request, reply) {
    try {
        const currentUser = await getCurrentUser();
        const userId = await getUserId(currentUser.user.email);

        request.userId = userId;

    } catch (error) {
        console.error('Error validating session:', error);
        reply.code(401).send({ error: 'Unauthorized' });
        throw error; // Rethrow the error to be caught by the route handler
    }
}


module.exports = { validateSession };
