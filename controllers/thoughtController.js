const { User, Thought } = require('../models');
const thought404Message = (id) => `Thought ID: ${id} not found!`
const thought200Message = (id) => `Thought ID: ${id} deleted!`
const reaction200Message = (id) => `Reaction ID: ${id} deleted!`

const thoughtController = {
  // Get all thoughts
  getAllThoughts(req, res) {
    Thought.find()
      .select('-__v')
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch(err => { 
        res.status(500).json(err)
    })
  },

  // Get a single thought
  getOneThought(req, res) {
    Thought.findOne({ _id: req.params.id })
      .select('-__v')
      .then((dbThoughtData) =>
      !dbThoughtData
        ? res.status(404).json({ message: 'No thought with that ID' })
        : res.json(dbThoughtData)
      )
      .catch((err) => res.status(400).json(err));
  },

  // Create a thought
  createThought(req, res) {
    Thought.create(req.body)
        .then((dbThoughtData) => {
              return User.findOneAndUpdate(
                  { _id: req.body.userId },
                  { $addToSet: { thoughts: dbThoughtData._id } },
                  { new: true }
              );
          })
          .then((dbThoughtData) =>
              !dbThoughtData
                  ? res.status(404).json({
                      message: 'Thought created, but no user found',
                  })
                  : res.json('Created thought')
          )
          .catch((err) => {
            console.log(err);
            return res.status(400).json(err)
          })
  },

  // Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((dbThoughtData) => 
              !dbThoughtData 
                ? res.status(404).json({ message: 'No thought ID' })
                : User.findOneAndUpdate(
                    { thoughts: req.params.thoughtId },
                    { $pull: { thoughts: req.params.thoughtId } },
                    { new: true }
                )
        )
        .then((dbUserData) =>
            !dbUserData
                ? res.status(404).json({
                    message: 'Thought created, no user ID',
                })
                : res.json({ message: 'Thought deleted' })
        )
        .catch((err) => res.status(500).json(err));
  },

  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId }, 
      { $set: req.body },
      { runValidators: true, new: true }
    )
          .then((dbThoughtData) =>
          !dbThoughtData
              ? res.status(404).json({ message: 'No thought with this ID' })
              : res.json(dbThoughtData)
      )
          .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
  },

  // React to a Thought
  createReaction(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { new: true, runValidators: true })
    .then(dbThoughtData =>  dbThoughtData 
      ? res.json(dbThoughtData) 
      : res.status(404).json({ message: 'No thought with this id!' }))
    .catch(err => res.status(400).json(err))
  },

  // Unreact to a Thought
  removeReaction(req, res) {
      Thought.findOneAndUpdate(
        { _id: req.params.thoughtId}, 
        { $pull: { reactions: { _id: params.reactionId} } }, 
        { runValidators: true, new: true }
      )
      .then(dbThoughtData =>  dbThoughtData 
        ? res.json(reaction200Message(params.thoughtId)) 
        : res.status(404).json({ message: 'No thought with this ID' }))
      .catch(err => res.status(404).json(err))
  }
};

module.exports = thoughtController