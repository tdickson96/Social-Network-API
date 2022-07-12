const { User, Thought } = require('../models');
const thought404Message = (id) => `Thought ID: ${id} not found!`
const thought200Message = (id) => `Thought ID: ${id} deleted!`
const reaction200Message = (id) => `Reaction ID: ${id} deleted!`

const thoughtController = {
  // Get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({ path: 'reactions', select: '-__v'})
      .select('-__v')
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch(err => { 
        res.status(500).json(err)
    })
  },

  // Get a single thought
  getOneThought({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({ path: 'reactions', select: '__v' })
      .select('-__v')
      .then((dbThoughtData) =>
        dbThoughtData
          ? res.json(dbThoughtData)
          : res.status(404)
          .json({ message: thought404Message(params.id) })
      )
      .catch((err) => res.status(404).json(err))
  },

  // Create a thought
  createThought({ body }, res) {
    Thought.create({ thoughtText: body.thoughtText, username: body.username })
      .then(({ _id }) => User.findOneAndUpdate({ _id: body.userId }, { $push: { thoughts: _id } }, { new: true }))
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        return res.status(400).json(err)
      })
  },

  // Delete a thought
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then(dbThoughtData => dbThoughtData 
        ? res.json(thought200Message(dbThoughtData._id)) 
        : res.status(404).json({ message: thought404Message(params.id) }))
      .catch(err => res.status(404).json(err))
},

  // Update a thought
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true, new: true })
      .populate({path: 'reactions', select: '-__v'})
      .select('-___v')
      .then(dbThoughtData =>  dbThoughtData 
        ? res.json(dbThoughtData) 
        : res.status(404).json({ message: thought404Message(params.id) }))
      .catch(err => res.status(400).json(err))
  },

  // React to a Thought
  createReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: { reactionBody: body.reactionBody, username: body.username} } },
        { new: true, runValidators: true })
    .then(dbThoughtData =>  dbThoughtData 
      ? res.json(dbThoughtData) 
      : res.status(404).json({ message: thought404Message(params.id) }))
    .catch(err => res.status(400).json(err))
  },

  // Unreact to a Thought
  removeReaction({ params }, res) {
      Thought.findOneAndUpdate({ _id: params.thoughtId}, { $pull: { reactions: { _id: params.reactionId} } }, { new: true})
      .then(dbThoughtData =>  dbThoughtData 
        ? res.json(reaction200Message(params.thoughtId)) 
        : res.status(404).json({ message: thought404Message(params.id) }))
      .catch(err => res.status(404).json(err))
  }
};

module.exports = thoughtController
