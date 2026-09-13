import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Photo } from '../models/Photo.js';

export const DEFAULT_CUSTOM_TEXTS = {
  heroTitle1: 'In all the world,',
  heroTitle2: 'there is no heart',
  heroTitle3: 'for me like yours.',
  heroSealText: 'AN ODE TO LIFELONG DEVOTION • EST. FOREVER •',
  heroCardTag: 'postmarked with love',
  manifestoTitle:
    'Four pillars of my love, numbered like chapters of a book without an ending.',
  chapter1Title: 'The Sanctuary of Your Laugh',
  chapter1Quote:
    'In a noisy world, your voice is my grounding silence. Every heavy day unspools the moment you smile.',
  chapter2Title: 'The Everyday Magic',
  chapter2Quote:
    'Not just the anniversaries, but the Tuesday morning coffees, the warm socks on chilly floors, and the quiet glances across crowded rooms.',
  chapter3Title: 'Unshakable Loyalty',
  chapter3Quote:
    'To be the anchor when storms roll in, and the warm fire when night falls. Through every unknown horizon, I stand beside you.',
  chapter4Title: 'The Infinite Horizon',
  chapter4Quote:
    'Loving you is not a chapter that concludes; it is the entire book, written in ink that outlives the stars.',
  metric1Value: '∞',
  metric1Label: 'laughs shared & counting',
  metric2Value: '10,000+',
  metric2Label: 'sunrises still to come',
  metric3Value: '1',
  metric3Label: 'question that changes everything',
  proposalTitle: 'Will you love me forever?',
  celebrationTitle: 'Forever, then.',
  celebrationMessage:
    'You said yes — and just like that, every tomorrow became a promise. I will love you through quiet dawns and golden sunsets, in this lifetime and every one after.',
  qrSpecialMessage:
    'My love, every heartbeat of mine belongs to you. Open this letter to begin our forever story.',
  footerTagline: 'Handcrafted with boundless love • vow locked',
};

// Default initial curated memories
const INITIAL_CURATED_PHOTOS = [
  {
    id: 'p-default-1',
    _id: 'p-default-1',
    url: 'https://images.unsplash.com/photo-1543829969-57899edf981b?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
    caption: 'The moment time stood still with you.',
    date: 'Golden Hour Glow',
    rotation: '-2deg',
    uploader: 'Romeo',
    username: 'love',
    createdAt: new Date(),
  },
  {
    id: 'p-default-2',
    _id: 'p-default-2',
    url: 'https://images.unsplash.com/photo-1614991539310-630818071643?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
    caption: 'Letters written in heartbeats, not words.',
    date: 'Every Morning',
    rotation: '3deg',
    uploader: 'Romeo',
    username: 'love',
    createdAt: new Date(),
  },
  {
    id: 'p-default-3',
    _id: 'p-default-3',
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
    caption: 'The warmth of our quiet, slow Tuesday evenings.',
    date: 'Candlelight Hours',
    rotation: '-1.5deg',
    uploader: 'Romeo',
    username: 'love',
    createdAt: new Date(),
  },
  {
    id: 'p-default-4',
    _id: 'p-default-4',
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
    caption: "Every road feels like home as long as you're beside me.",
    date: 'Endless Horizons',
    rotation: '2.5deg',
    uploader: 'Romeo',
    username: 'love',
    createdAt: new Date(),
  },
  {
    id: 'p-default-5',
    _id: 'p-default-5',
    url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
    caption: 'The simple magic of your laughter.',
    date: 'Pure Serendipity',
    rotation: '-3deg',
    uploader: 'Romeo',
    username: 'love',
    createdAt: new Date(),
  },
  {
    id: 'p-default-6',
    _id: 'p-default-6',
    url: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
    caption: 'A million sunsets would never be enough.',
    date: 'Forever & Always',
    rotation: '1.5deg',
    uploader: 'Romeo',
    username: 'love',
    createdAt: new Date(),
  },
];

// In-memory cache for ultra-fast response and seamless fallback
const fallbackUsers = new Map();
let fallbackPhotos = [...INITIAL_CURATED_PHOTOS];

// Seed default 'love' / 'forever' user into fallback store
async function initFallbackStore() {
  const defaultUser = (process.env.ADMIN_USERNAME || 'love').toLowerCase();
  const defaultPass = process.env.ADMIN_PASSWORD || 'forever';
  const hashed = await bcrypt.hash(defaultPass, 10);
  const defaultId = 'user_love_forever_001';

  fallbackUsers.set(defaultUser, {
    _id: defaultId,
    id: defaultId,
    username: defaultUser,
    password: defaultPass,
    passwordHash: hashed,
    senderName: 'Romeo',
    recipientName: 'Juliet',
    proposalNote: 'Every heartbeat, every dawn, every ordinary Tuesday — I want them all with you.',
    customTexts: { ...DEFAULT_CUSTOM_TEXTS },
    shareCode: defaultUser,
    role: 'admin',
    async comparePassword(candidate) {
      return candidate === this.password || (await bcrypt.compare(candidate, this.passwordHash));
    },
  });
}

initFallbackStore().catch(() => {});

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

function mergeCustomTexts(userTexts) {
  return {
    ...DEFAULT_CUSTOM_TEXTS,
    ...(userTexts && typeof userTexts === 'object' ? userTexts : {}),
  };
}

export const dbService = {
  isMongoConnected,

  async findUserByUsername(username) {
    const clean = username.trim().toLowerCase();
    if (isMongoConnected()) {
      try {
        const user = await User.findOne({ username: clean });
        if (user) {
          user.customTexts = mergeCustomTexts(user.customTexts);
          return user;
        }
      } catch (err) {
        console.warn('[DB Service] Atlas lookup fallback:', err.message);
      }
    }
    const memUser = fallbackUsers.get(clean);
    if (memUser) {
      memUser.customTexts = mergeCustomTexts(memUser.customTexts);
      return memUser;
    }
    return null;
  },

  async findUserById(id) {
    const strId = String(id);
    if (isMongoConnected()) {
      try {
        const user = await User.findById(id).select('-password');
        if (user) {
          user.customTexts = mergeCustomTexts(user.customTexts);
          return user;
        }
      } catch (err) {
        console.warn('[DB Service] Atlas findById fallback:', err.message);
      }
    }
    for (const u of fallbackUsers.values()) {
      if (String(u._id) === strId || String(u.id) === strId) {
        u.customTexts = mergeCustomTexts(u.customTexts);
        return u;
      }
    }
    return null;
  },

  async createUser({ username, password, senderName, recipientName, customTexts, role = 'lover' }) {
    const clean = username.trim().toLowerCase();
    const mergedTexts = mergeCustomTexts(customTexts);
    let savedUser = null;

    if (isMongoConnected()) {
      try {
        savedUser = await User.create({
          username: clean,
          password,
          senderName: senderName?.trim() || 'Romeo',
          recipientName: recipientName?.trim() || 'Juliet',
          proposalNote:
            mergedTexts.proposalNote ||
            'Every heartbeat, every dawn, every ordinary Tuesday — I want them all with you.',
          customTexts: mergedTexts,
          shareCode: clean,
          role,
        });
      } catch (err) {
        console.warn('[DB Service] Atlas create user fallback:', err.message);
      }
    }

    const hashed = await bcrypt.hash(password, 10);
    const id = savedUser ? String(savedUser._id) : `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const memoryUser = {
      _id: id,
      id,
      username: clean,
      password,
      passwordHash: hashed,
      senderName: senderName?.trim() || 'Romeo',
      recipientName: recipientName?.trim() || 'Juliet',
      proposalNote:
        mergedTexts.proposalNote ||
        'Every heartbeat, every dawn, every ordinary Tuesday — I want them all with you.',
      customTexts: mergedTexts,
      shareCode: clean,
      role,
      async comparePassword(candidate) {
        return candidate === this.password || (await bcrypt.compare(candidate, this.passwordHash));
      },
    };

    fallbackUsers.set(clean, memoryUser);
    return savedUser || memoryUser;
  },

  async updateUserProfile(userId, { senderName, recipientName, proposalNote, customTexts }) {
    let updated = null;
    if (isMongoConnected()) {
      try {
        const u = await User.findById(userId);
        if (u) {
          if (senderName) u.senderName = senderName.trim();
          if (recipientName) u.recipientName = recipientName.trim();
          if (proposalNote !== undefined) u.proposalNote = proposalNote.trim();
          if (customTexts && typeof customTexts === 'object') {
            u.customTexts = {
              ...(u.customTexts ? (u.customTexts.toObject ? u.customTexts.toObject() : u.customTexts) : {}),
              ...customTexts,
            };
            u.markModified('customTexts');
          }
          await u.save();
          updated = u;
        }
      } catch (err) {
        console.warn('[DB Service] Atlas update profile fallback:', err.message);
      }
    }

    const strId = String(userId);
    for (const memUser of fallbackUsers.values()) {
      if (String(memUser._id) === strId || String(memUser.id) === strId) {
        if (senderName) memUser.senderName = senderName.trim();
        if (recipientName) memUser.recipientName = recipientName.trim();
        if (proposalNote !== undefined) memUser.proposalNote = proposalNote.trim();
        if (customTexts && typeof customTexts === 'object') {
          memUser.customTexts = {
            ...(memUser.customTexts || DEFAULT_CUSTOM_TEXTS),
            ...customTexts,
          };
        }
        if (!updated) updated = memUser;
        break;
      }
    }
    if (updated) {
      updated.customTexts = mergeCustomTexts(updated.customTexts);
    }
    return updated;
  },

  async getPhotos({ username, userId }) {
    if (isMongoConnected()) {
      try {
        const query = {};
        if (username) query.username = username.toLowerCase();
        else if (userId) query.user = userId;
        const photos = await Photo.find(query).sort({ createdAt: -1 });
        if (photos && photos.length > 0) return photos;
      } catch (err) {
        console.warn('[DB Service] Atlas getPhotos fallback:', err.message);
      }
    }

    if (username) {
      const clean = username.toLowerCase();
      const userPhotos = fallbackPhotos.filter((p) => p.username === clean);
      return userPhotos.length > 0 ? userPhotos : fallbackPhotos;
    }
    return fallbackPhotos;
  },

  async createPhoto(photoData) {
    let saved = null;
    if (isMongoConnected()) {
      try {
        saved = await Photo.create(photoData);
      } catch (err) {
        console.warn('[DB Service] Atlas createPhoto fallback:', err.message);
      }
    }

    const memoryItem = {
      _id: saved ? String(saved._id) : `photo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      id: saved ? String(saved._id) : `photo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      ...photoData,
      createdAt: new Date(),
    };

    fallbackPhotos.unshift(memoryItem);
    return saved || memoryItem;
  },

  async deletePhoto(photoId, currentUser) {
    let deleted = false;
    if (isMongoConnected()) {
      try {
        const photo = await Photo.findById(photoId);
        if (photo) {
          const isOwner =
            (photo.user && photo.user.equals(currentUser._id)) ||
            photo.username === currentUser.username ||
            currentUser.role === 'admin';
          if (isOwner) {
            await Photo.findByIdAndDelete(photoId);
            deleted = true;
          }
        }
      } catch (err) {
        console.warn('[DB Service] Atlas deletePhoto fallback:', err.message);
      }
    }

    const beforeLen = fallbackPhotos.length;
    fallbackPhotos = fallbackPhotos.filter(
      (p) => String(p.id || p._id) !== String(photoId)
    );
    if (fallbackPhotos.length < beforeLen) {
      deleted = true;
    }

    return deleted;
  },
};
