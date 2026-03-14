import { delay } from '../utils/delay';

const getCurrentUserId = () => {
  const user = JSON.parse(localStorage.getItem('jobPortalUser') || 'null');
  return user?.userId || user?.id;
};

const getStorageKey = () => `userProfile_${getCurrentUserId()}`;

/**
 * Get the current user's profile
 */
export const getProfile = async () => {
  await delay();
  const data = localStorage.getItem(getStorageKey());
  return data ? JSON.parse(data) : null;
};

/**
 * Create or update user profile
 */
export const updateProfile = async (profileData, profilePicture, resume) => {
  await delay();
  const existing = JSON.parse(localStorage.getItem(getStorageKey()) || '{}');

  const updated = {
    ...existing,
    ...profileData,
    id: existing.id || Date.now(),
    updatedAt: new Date().toISOString(),
  };

  // Handle profile picture file
  if (profilePicture) {
    const dataUrl = await fileToDataUrl(profilePicture);
    updated.profilePictureData = dataUrl;
    updated.profilePictureName = profilePicture.name;
  }

  // Handle resume file
  if (resume) {
    const dataUrl = await fileToDataUrl(resume);
    updated.resumeData = dataUrl;
    updated.resumeName = resume.name;
  }

  localStorage.setItem(getStorageKey(), JSON.stringify(updated));
  return updated;
};

/**
 * Get profile picture URL
 */
export const getProfilePictureUrl = async () => {
  await delay();
  const profile = JSON.parse(localStorage.getItem(getStorageKey()) || '{}');
  return profile.profilePictureData || null;
};

/**
 * Download resume
 */
export const downloadResume = async () => {
  await delay();
  const profile = JSON.parse(localStorage.getItem(getStorageKey()) || '{}');
  if (profile.resumeData) {
    const link = document.createElement('a');
    link.href = profile.resumeData;
    link.download = profile.resumeName || 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Get resume as URL for preview
 */
export const getResumeUrl = async () => {
  await delay();
  const profile = JSON.parse(localStorage.getItem(getStorageKey()) || '{}');
  return profile.resumeData || null;
};

// Helper to convert File to data URL
const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
