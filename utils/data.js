const usersArr = [
  'Aaran',
  'Aaren',
  'Aarez',
  'Aarman',
  'Aaron',
  'Aaron-James',
  'Aarron',
  'Aaryan',
  'Aaryn',
  'Aayan',
  'Aazaan',
  'Abaan',
  'Abbas',
  'Abdallah',
  'Abdalroof',
  'Abdihakim',
  'Abdirahman',
  'Abdisalam',
  'Abdul',
  'Abdul-Aziz'
];

const emailsArr = [
  'Abdalla@mail.com',
  'Althea@mail.com',
  'Andrew@mail.com',
  'Ben@mail.com',
  'Dennis@mail.com',
  'Dylan@mail.com',
  'Edward@mail.com',
  'Garrett@mail.com',
  'Patrick@mail.com',
  'James@mail.com',
  'Abdalla11@mail.com',
  'Althea22@mail.com',
  'Andrew33@mail.com',
  'Ben44@mail.com',
  'Dennis55@mail.com',
  'Dylan66@mail.com',
  'Edward77@mail.com',
  'Garrett88@mail.com',
  'Patrick99@mail.com',
  'James00@mail.com'
]

const thoughtsArr = [
  'Decision Tracker',
  'Find My Phone',
  'Learn Piano',
  'Starbase Defender',
  'Tower Defense',
  'Monopoly Money Manager',
  'Movie trailers',
  'Hello world',
  'Stupid Social Media App',
  'Notes',
  'Messages',
  'Email',
  'Compass',
  'Firefox',
  'Running app',
  'Cooking app',
  'Poker',
  'Deliveries',
];

const reactionsArr = [
  'Wow!',
  'Great!',
  'Boo!',
  'Weird?',
  'Massive!',
  'No way!',
  'Honestly...',
  'Yawwwwwnnn...',
  'Stupid!',
  'Why?',
  'Lie!',
  'Truth!',
  'Be honest!',
  'No cap!',
  'Running',
  'Cooking',
  'Cards',
  'Beastly',
  'Keep it 100!',
  'Basic...'
];

const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomFriends = (friends, user) => {
    let results = new Set();
    for (let i = 0; i < friends; i++) {
        const retrievedFriend = getRandomArrItem(usernamesArr);
        if (!(retrievedFriend === user)) results.add(retrievedFriend);
    }
    results = Array.from(results);
    return results;
}

const getRandomReactions = (numReactions) => {
    const results = [];
    for (let i = 0; i < numReactions; i++) {
        results.push({
            reactionBody: getRandomArrItem(reactionsArr),
            username: getRandomArrItem(usernamesArr)
        });
    }
    return results;
};

const getRandomThoughts = (numThoughts, numReactions, user) => {
    const results = [];
    for (let i = 0; i < numThoughts; i++) {
        results.push({
            thoughtText: getRandomArrItem(thoughtsArr),
            username: user,
            reactions: getRandomReactions(numReactions)
        });
    }
    return results;
};

module.exports = {
    usernamesArr,
    emailsArr,
    getRandomFriends,
    getRandomThoughts
}
