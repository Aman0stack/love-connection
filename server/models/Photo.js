import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    public_id: {
      type: String,
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
      default: 'A moment I treasure forever.',
    },
    date: {
      type: String,
      trim: true,
      default: 'Cherished Memory',
    },
    rotation: {
      type: String,
      default: '-1.5deg',
    },
    uploader: {
      type: String,
      default: 'Lover',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Map _id to id for frontend compatibility
PhotoSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

export const Photo = mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);
