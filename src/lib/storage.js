import { storage, isUsingMock } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Upload an image file.
 * Returns the download URL.
 */
export async function uploadImage(file, path = 'products') {
	if (!file) return '';

	if (isUsingMock) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				resolve(reader.result); // Base64 Data URL
			};
			reader.onerror = () => {
				reject(new Error('Failed to read file as base64.'));
			};
			reader.readAsDataURL(file);
		});
	} else {
		const filename = `${Date.now()}_${file.name}`;
		const storageRef = ref(storage, `${path}/${filename}`);
		const snapshot = await uploadBytes(storageRef, file);
		const downloadUrl = await getDownloadURL(snapshot.ref);
		return downloadUrl;
	}
}

/**
 * Delete an image by its download URL
 */
export async function deleteImage(imageUrl) {
	if (isUsingMock || !imageUrl) {
		return true; // No action needed for simulated images
	}

	try {
		// Only try to delete if it looks like a Firebase Storage URL
		if (imageUrl.includes('firebasestorage.googleapis.com')) {
			const storageRef = ref(storage, imageUrl);
			await deleteObject(storageRef);
		}
		return true;
	} catch (error) {
		console.error('Failed to delete image from Firebase storage:', error);
		return false;
	}
}
