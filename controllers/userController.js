const { User, Thought } = require('../models')
const user404Message = (id) => `User ID: ${id} not found!`
const user204Message = (id) => `User ID: ${id} deleted!`

const userController = {
    // Get all users 
    getAllUsers(req, res) {
        User.find({})
          .populate({ path: 'thoughts', select: '-__v'})
          .populate({ path: 'friends', select: '-__v'})
          .select('-__v')
          // dbThoughtData
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.status(500).json(err))
    },

    // Get a single user 
    getOneUser({ params }, res) {
        User.findOne({ _id: params.id })
          .populate({ path: 'friends', select: '-__v' })
          .populate({ path: 'thoughts', select: '-__v', populate: { path: 'reactions'}})
          .select('-__v')
          .then(dbUserData =>  dbUserData 
            ? res.json(dbUserData) 
            : res.status(404).json({ message: user404Message(params.id) }))
          .catch(err => res.status(404).json(err))
    },

    // Create user 
    createUser({ body }, res) {
        User.create({ username: body.username, email: body.email})
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err))
    },

    // Update user 
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUserData =>  dbUserData 
          ? res.json(dbUserData) 
          : res.status(404).json({ message: user404Message(params.id) }))
        .catch(err => res.status(400).json(err))
    },

    // Delete user 
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
          .then(dbUserData => {
              if (!dbUserData) {
                  return res.status(404).json({ message: user404Message(params.id) })
              }
              Thought.deleteMany({ username: dbUserData.username}).then(deletedData => deletedData 
                ? res.json({ message: user204Message(params.id)}) 
                : res.status(404).json({ message: user404Message(params.id) }))
          })
        .catch(err => res.status(400).json(err))
    },

    // Add friend
    addFriend({ params }, res) {
        User.findOneAndUpdate({ _id: params.userId}, { $push: { friends: params.friendId } }, { new: true, runValidators: true })
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.status(400).json(err))
    },

    // Remove friend 
    removeFriend({ params }, res) {
        User.findOneAndUpdate({ _id: params.userId}, { $pull: { friends: params.friendId} })
          .then(dbUserData => res.status(200).json(user204Message(params.friendId, 'User')))
          .catch(err => res.json(err))
    }
}

module.exports = userController