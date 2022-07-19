const connection = require('../config/connection');
const { User, Thought } = require('../models');
const {
    usersArr,
    emailsArr,
    getRandomFriends,
    getRandomThoughts,
    getRandomArrItem
} = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('--- CONNECTED ---');

    await User.deleteMany({});

    await Thought.deleteMany({});

    // create new thoughts
    const thoughts = [];

    for (let i = 0; i < usersArr.length; i++) {
        const numThoughts = 10;
        const numReactions = 10;
        const user = usersArr[i];

        const userThoughts = getRandomThoughts(numThoughts, numReactions, user);
    
        thoughts.push(...userThoughts)
      };

    await Thought.collection.insertMany(thoughts);
    // console.log(thoughts);
    console.log('--- THOUGHTS SEEDED ---');

    // create new users
    const users = [];

    for (let i = 0; i < usersArr.length; i++) {
        const email = emailsArr[i];
        const user = usersArr[i];
        const userThoughts = [];

        const thoughtData = await Thought.find().lean();

        // console.log(thoughtData);
        const randomThoughtData = getRandomArrItem(thoughtData);
        
        users.push({
            username: user,
            email: email,
            thoughts: [randomThoughtData._id],
            friends: []
        });
      }

      await User.collection.insertMany(users);
    //   console.log(users);
      console.log('--- USERS SEEDED ---');

      return;
});

