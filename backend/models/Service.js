const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: false,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['hospital', 'ATM', 'shop', 'others']
    },
    rating: {
      type: Number,
      required: false,
      min: 0,
      max: 5
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { versionKey: false }
);

serviceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Service', serviceSchema);
