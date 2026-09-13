import express from 'express';
import multer from 'multer';
import { dbService } from '../services/store.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
});

// GET /api/photos - Get photos scoped by user query or session
router.get('/', optionalAuth, async (req, res) => {
  try {
    const targetUsername = req.query.u?.trim().toLowerCase();
    const userId = req.user?._id || req.user?.id;

    const photos = await dbService.getPhotos({ username: targetUsername, userId: !targetUsername ? userId : undefined });
    res.json({ success: true, photos });
  } catch (err) {
    console.error('[Get Photos Error]:', err);
    res.status(500).json({ error: 'Failed to retrieve photos' });
  }
});

// GET /api/photos/site/:username - Public endpoint for the receiver opening the QR link
router.get('/site/:username', async (req, res) => {
  try {
    const cleanUsername = req.params.username.trim().toLowerCase();
    const user = await dbService.findUserByUsername(cleanUsername);

    if (!user) {
      return res.status(404).json({ error: 'Proposal site not found' });
    }

    const photos = await dbService.getPhotos({ username: user.username });

    return res.json({
      success: true,
      user: {
        username: user.username,
        senderName: user.senderName || 'Romeo',
        recipientName: user.recipientName || 'Juliet',
        proposalNote: user.proposalNote || 'Every heartbeat, every dawn, every ordinary Tuesday — I want them all with you.',
        customTexts: user.customTexts,
        shareCode: user.shareCode || user.username,
      },
      photos: photos && photos.length > 0 ? photos : [],
    });
  } catch (err) {
    console.error('[Get User Site Error]:', err);
    res.status(500).json({ error: 'Failed to retrieve personalized site' });
  }
});

// POST /api/photos/upload - Upload to Cloudinary & save under logged-in user
router.post('/upload', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { caption, date, rotation, imageUrl } = req.body;
    let finalUrl = '';
    let publicId = '';

    if (req.file) {
      console.log(`[Cloudinary] Uploading file buffer for user: ${req.user.username}...`);
      const uploadResult = await uploadBufferToCloudinary(
        req.file.buffer,
        `forever_love/${req.user.username}`
      );
      finalUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    } else if (imageUrl && imageUrl.trim()) {
      console.log(`[Cloudinary] Uploading remote URL for user: ${req.user.username}...`);
      const uploadResult = await cloudinary.uploader.upload(imageUrl.trim(), {
        folder: `forever_love/${req.user.username}`,
        transformation: [{ quality: 'auto:best', fetch_format: 'auto' }],
      });
      finalUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    } else {
      return res.status(400).json({ error: 'No image file or URL provided' });
    }

    // Save record with user reference
    const newPhoto = await dbService.createPhoto({
      url: finalUrl,
      public_id: publicId,
      caption: caption?.trim() || 'A moment I treasure forever.',
      date: date?.trim() || 'Sweet Memory',
      rotation: rotation || (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 2.5) + 'deg',
      uploader: req.user.senderName || req.user.username,
      user: req.user._id || req.user.id,
      username: req.user.username,
    });

    console.log(`[Database] Photo saved for ${req.user.username} with ID: ${newPhoto._id || newPhoto.id}`);
    return res.status(201).json({ success: true, photo: newPhoto });
  } catch (err) {
    console.error('[Photo Upload Error]:', err);
    return res.status(500).json({ error: 'Failed to upload photo: ' + err.message });
  }
});

// DELETE /api/photos/:id - Protected removal scoped to photo owner
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await dbService.deletePhoto(req.params.id, req.user);
    if (!deleted) {
      return res.status(404).json({ error: 'Photo not found or unauthorized' });
    }

    return res.json({ success: true, message: 'Photo deleted successfully' });
  } catch (err) {
    console.error('[Delete Photo Error]:', err);
    return res.status(500).json({ error: 'Failed to delete photo' });
  }
});

export default router;
