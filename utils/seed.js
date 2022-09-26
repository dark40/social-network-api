const connection = require('../config/connection');
const { User, Thought } = require('../models');


connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');

    // Drop existing data
    await User.deleteMany({});

    await Thought.deleteMany({});
    
})
