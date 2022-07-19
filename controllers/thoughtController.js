const { User, Thought } = require('../models');

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
      .populate('reactions')
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
                  { _id: req.body.id },
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
    Thought.findOneAndRemove(
      { _id: req.params.id }
    )
    .then((dbThoughtData) => 
      !dbThoughtData 
        ? res.status(404).json({ message: 'No thought ID' })
        : User.findOneAndUpdate(
          { thoughts: req.params.id },
          { $pull: { thoughts: req.params.id } },
          { new: true }
        )
      )
    .then((dbUserData) =>
      !dbUserData
        ? res.status(404).json(
          { message: 'Thought created, no user ID' }
        )
        : res.json({ message: 'Thought deleted' })
      )
    .catch((err) => res.status(500).json(err));
  },

  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.id }, 
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
        { _id: req.params.id },
        { $push: { reactions: req.body } },
        { new: true, runValidators: true })
    .then(dbThoughtData =>  dbThoughtData 
      ? res.json(dbThoughtData) 
      : res.status(404).json({ message: 'No thought with this id!' }))
    .catch(err => res.status(400).json(err))
  },

  // Unreact to a Thought
  removeReaction(req, res) {
      Thought.findOneAndUpdate(
        { _id: req.params.id}, 
        { $pull: { reactions: { reactionId: req.params.reactionId} } }, 
        { new: true }
      )
      .then(res.json('Reaction deleted'))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController