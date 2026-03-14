import { delay } from '../utils/delay';
import { jobs } from '../data/mockData';

const getCurrentUserId = () => {
  const user = JSON.parse(localStorage.getItem('jobPortalUser') || 'null');
  return user?.userId || user?.id;
};

const getStorageKey = () => `savedJobIds_${getCurrentUserId()}`;
const getSavedEntries = () => JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
const saveSavedEntries = (entries) => localStorage.setItem(getStorageKey(), JSON.stringify(entries));

/**
 * Get all saved jobs for the current user
 */
export const getSavedJobs = async () => {
  await delay();
  const entries = getSavedEntries();
  const globalPostedJobs = JSON.parse(localStorage.getItem('globalPostedJobs') || '[]');
  const allJobs = [...jobs, ...globalPostedJobs];
  return entries.map(entry => ({
    job: allJobs.find(j => j.id === entry.jobId) || {},
    savedAt: entry.savedAt,
  }));
};

/**
 * Get all saved job IDs for the current user
 */
export const getSavedJobIds = async () => {
  await delay();
  return getSavedEntries().map(e => e.jobId);
};

/**
 * Save a job
 */
export const saveJob = async (jobId) => {
  await delay();
  const entries = getSavedEntries();
  if (!entries.some(e => e.jobId === jobId)) {
    entries.push({ jobId, savedAt: new Date().toISOString() });
    saveSavedEntries(entries);
  }
  return { jobId };
};

/**
 * Unsave a job
 */
export const unsaveJob = async (jobId) => {
  await delay();
  const entries = getSavedEntries().filter(e => e.jobId !== jobId);
  saveSavedEntries(entries);
};

/**
 * Check if a job is saved
 */
export const isJobSaved = async (jobId) => {
  await delay();
  return getSavedEntries().some(e => e.jobId === jobId);
};
