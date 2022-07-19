const thoughts = require('express').Router();
const { 
  getAllThoughts, 
  getOneThought, 
  createThought,
  updateThought,
  deleteThought,
  createReaction,
  removeReaction
} = require('../../controllers/thoughtController')
// api -> routes -> base -> thoughts -> file

thoughts.route('/')
.get(getAllThoughts)
.post(createThought);

thoughts.route('/:id')
.get(getOneThought)
.put(updateThought)
.delete(deleteThought);

thoughts.route('/:id/reactions')
.post(createReaction);

thoughts.route('/:id/reactions/:reactionId')
.delete(removeReaction);

module.exports = thoughts;
