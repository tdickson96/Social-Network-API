const { User, Thought } = require('../models');

const userController = {
    // Get all users 
    getAllUsers(req, res) {
        User.find()
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(500).json(err));
    },

    // Get a single user 
    getOneUser(req, res) {
        User.findOne(
          { _id: req.params.userId }
        )
            .select('-__v')
            .then((dbUserData) =>   
                !dbUserData 
                  ? res.status(404).json({ message: 'User ID not found' })
                  : res.json(dbUserData)
        )
            .catch((err) => res.status(404).json(err));
    },

    // Create user 
    createUser(req, res) {
        User.create(req.body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.status(400).json(err));
    },

    // Update user 
    updateUser(req, res) {
        User.findOneAndUpdate(
          { _id: req.params.userId }, 
          { $set: req.body },
          { new: true, runValidators: true }
        )
            .then((dbUserData) => {
              if (!dbUserData) {
                  return res.status(404).json({ message: 'Cannot update user' });
              }
              res.json(dbUserData);
            }) 
            .catch((err) => res.status(400).json(err)
            );
    },

    // Delete user 
    deleteUser(req, res) {
      User.findOneAndDelete(
        { _id: req.params.userId }
      )
          .then((dbUserData) => {
              if (!dbUserData) {
              return res.status(404).json({ message: 'No user with this id' });
          }   
              return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
          })
          .then(() => {
              res.json({ message: 'User deleted' });
          })
          .catch((err) => {
              console.log(err);
              res.status(400).json(err);
          });
  },

    // Add friend
    addFriend(req, res) {
        User.findOneAndUpdate(
          { _id: params.userId}, 
          { $addToSet: { friends: req.params.friendId } }, 
          { new: true, runValidators: true }
        )
          .then(dbUserData => res.json(dbUserData))
          .catch((err) => res.status(400).json(err));
    },

    // Remove friend 
    removeFriend(req, res) {
        User.findOneAndUpdate(
          { _id: params.userId}, 
          { $pull: { friends: req.params.friendId} },
          { runValidators: true, new: true}
        )
        .then((user) => {
          if (!user) {
              return res.status(404).json({ message: 'User with this ID does not exist.' });
          }
          res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  }
};

module.exports = userController;