const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomName, getRandomThoughts } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');

    // Drop existing data
    await User.deleteMany({});

    await Thought.deleteMany({});

    const users = [];

    for (let i = 0; i < 20; i++) {
        const username = getRandomName();
        const thoughts = getRandomThoughts(3);
        const email = `${username}@test.com`;

        users.push({
            username,
            email,
            thoughts,
        });

    }

    await User.collection.insertMany(users);

    await Thought.collection.insertMany({
        thoughtText: [...users.thoughts],
        username: [...users.username],
    });

})
