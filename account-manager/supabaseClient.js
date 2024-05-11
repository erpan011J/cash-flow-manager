// supabaseClient.js
require('dotenv').config();
const supabaseUrl = process.env.SUPABASE_URL;
const anonymousPublicKey = process.env.ANONYMOUS_PUBLIC_KEY;
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(supabaseUrl, anonymousPublicKey);

module.exports = { supabase };
