const { Schema, model } = require('mongoose');
const { format_date } = require('../utils/formatter');

// Posts by Users
const ThoughtSchema = new Schema(
  {
      thoughtText: {
          type: String,
          required: true,
          minlength: 1,
          maxLength: 280
      },
      createdAt: {
          type: Date,
          default: Date.now,
          get: (time) => format_date(time) 
      },
      username: {
          type: String,
          required: true
      },
      reactions: [reactionSchema]
  },
  {
      toJSON: {
          virtuals: true,
          getters: true 
      },
      id: false
  }
)

// Reactions on Posts by Users
const reactionSchema = new Schema(
  {
      reactionId: {
          type: Schema.Types.ObjectId,
          default: () => new Types.ObjectId()
      },
      reactionBody: {
          type: String,
          required: true,
          maxLength: 280
      },
      username: {
          type: String,
          required: true
      },
      createdAt: {
          type: Date,
          default: Date.now,
          get: (time) => format_date(time)
      }
  },
  {
      toJSON: {
          getters: true
      },
      id: false
  }
)

// a virtual is a property that is not stored in MongoDB
// `reactionCount` is now a property on Thought
ThoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema)

module.exports = Thought
