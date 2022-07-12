const users = require('express').Router();
const {
    getAllUsers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend
} = require('../../controllers/user-controller');
// api -> routes -> base -> controllers -> file

users.route('/')
      .get(getAllUsers)
      .post(createUser);

users.route('/:id')
      .get(getOneUser)
      .put(updateUser)
      .delete(deleteUser);

users.route('/:userId/friends/:friendId')
      .post(addFriend)
      .delete(removeFriend);

module.exports = users;
