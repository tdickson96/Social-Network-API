const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/]
    },

    thoughts: [
      {
          type: Schema.Types.ObjectId,
          ref: 'Thought'
      }
    ],

    friends: [
      {
          type: Schema.Types.ObjectId,
          ref: 'User'
      }
    ]
  },

  {
    toJSON: {
      virtuals: true
    },
    id: false
  }
)

// a virtual is a property that is not stored in MongoDB
// `friendCount` is now a property on User
userSchema.virtual('friendCount').get(function() {
  return this.friends.length
});

userSchema.pre('findOneAndDelete', { document: false, query: true }, async function() {
  const doc = await this.model.findOne(this.getFilter());
  await Thought.deleteMany({ username: doc.username });
}); 

const User = model('User', userSchema);

module.exports = User;
