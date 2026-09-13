import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      trim: true,
      default: 'Romeo',
    },
    recipientName: {
      type: String,
      trim: true,
      default: 'Juliet',
    },
    proposalNote: {
      type: String,
      trim: true,
      default: 'Every heartbeat, every dawn, every ordinary Tuesday — I want them all with you.',
    },
    customTexts: {
      heroTitle1: { type: String, default: 'In all the world,' },
      heroTitle2: { type: String, default: 'there is no heart' },
      heroTitle3: { type: String, default: 'for me like yours.' },
      heroSealText: { type: String, default: 'AN ODE TO LIFELONG DEVOTION • EST. FOREVER •' },
      heroCardTag: { type: String, default: 'postmarked with love' },
      manifestoTitle: {
        type: String,
        default: 'Four pillars of my love, numbered like chapters of a book without an ending.',
      },
      chapter1Title: { type: String, default: 'The Sanctuary of Your Laugh' },
      chapter1Quote: {
        type: String,
        default: 'In a noisy world, your voice is my grounding silence. Every heavy day unspools the moment you smile.',
      },
      chapter2Title: { type: String, default: 'The Everyday Magic' },
      chapter2Quote: {
        type: String,
        default: 'Not just the anniversaries, but the Tuesday morning coffees, the warm socks on chilly floors, and the quiet glances across crowded rooms.',
      },
      chapter3Title: { type: String, default: 'Unshakable Loyalty' },
      chapter3Quote: {
        type: String,
        default: 'To be the anchor when storms roll in, and the warm fire when night falls. Through every unknown horizon, I stand beside you.',
      },
      chapter4Title: { type: String, default: 'The Infinite Horizon' },
      chapter4Quote: {
        type: String,
        default: 'Loving you is not a chapter that concludes; it is the entire book, written in ink that outlives the stars.',
      },
      metric1Value: { type: String, default: '∞' },
      metric1Label: { type: String, default: 'laughs shared & counting' },
      metric2Value: { type: String, default: '10,000+' },
      metric2Label: { type: String, default: 'sunrises still to come' },
      metric3Value: { type: String, default: '1' },
      metric3Label: { type: String, default: 'question that changes everything' },
      proposalTitle: { type: String, default: 'Will you love me forever?' },
      celebrationTitle: { type: String, default: 'Forever, then.' },
      celebrationMessage: {
        type: String,
        default:
          'You said yes — and just like that, every tomorrow became a promise. I will love you through quiet dawns and golden sunsets, in this lifetime and every one after.',
      },
      qrSpecialMessage: {
        type: String,
        default:
          'My love, every heartbeat of mine belongs to you. Open this letter to begin our forever story.',
      },
      footerTagline: { type: String, default: 'Handcrafted with boundless love • vow locked' },
    },
    shareCode: {
      type: String,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['admin', 'lover'],
      default: 'lover',
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
