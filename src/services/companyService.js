import { jobs, companiesData } from '../data/mockData';
import { delay } from '../utils/delay';

/**
 * Fetch all companies with their jobs
 */
export const fetchCompanies = async () => {
  await delay();
  return companiesData.map(company => ({
    ...company,
    jobs: jobs.filter(job => job.companyId === company.id),
  }));
};

/**
 * Fetch all jobs from all companies
 */
export const fetchAllJobs = async () => {
  await delay();
  // Include any employer-posted jobs from localStorage
  const globalPostedJobs = JSON.parse(localStorage.getItem('globalPostedJobs') || '[]');
  return [...jobs, ...globalPostedJobs];
};

/**
 * Fetch a single company by ID
 */
export const fetchCompanyById = async (id) => {
  await delay();
  return companiesData.find(c => c.id === parseInt(id)) || null;
};

/**
 * Fetch a company by name (for detail pages that use company name in URL)
 */
export const fetchCompanyByName = async (name) => {
  await delay();
  const companies = companiesData.map(company => ({
    ...company,
    jobs: jobs.filter(job => job.companyId === company.id),
  }));
  return companies.find(
    c => c.name.toLowerCase().replace(/[^a-z0-9]/g, '') === name.toLowerCase().replace(/[^a-z0-9]/g, '')
  ) || null;
};
