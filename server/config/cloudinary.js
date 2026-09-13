import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'txclzvp2',
  api_key: process.env.CLOUDINARY_API_KEY || '733515952714631',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'hsFIU7_F9N1_Anj_aqcBWu0lbeA',
  secure: true,
});

/**
 * Upload an in-memory file buffer directly to Cloudinary
 * @param {Buffer} buffer - File buffer from multer
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<Object>} Cloudinary upload result
 */
export function uploadBufferToCloudinary(buffer, folder = 'forever_love/memories') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto:best', fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Delete an image from Cloudinary by public_id
 * @param {string} publicId
 * @returns {Promise<Object>}
 */
export async function deleteFromCloudinary(publicId) {
  if (!publicId) return;
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn('[Cloudinary] Could not destroy image:', err.message);
  }
}

export default cloudinary;
