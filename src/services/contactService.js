import { delay } from '../utils/delay';

const STORAGE_KEY = 'contactMessages';
const getContacts = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
const saveContacts = (contacts) => localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));

/**
 * Submit contact form data
 */
export const submitContactForm = async (contactData) => {
  await delay();
  const contacts = getContacts();
  const newContact = {
    id: Date.now(),
    ...contactData,
    status: 'OPEN',
    createdAt: new Date().toISOString(),
  };
  contacts.push(newContact);
  saveContacts(contacts);
  return newContact;
};

/**
 * Fetch all contacts
 */
export const fetchAllContacts = async () => {
  await delay();
  return getContacts();
};

/**
 * Fetch open contact messages with sorting
 */
export const fetchOpenContactMsgsWithSort = async (sortBy = 'createdAt', sortDir = 'asc') => {
  await delay();
  let contacts = getContacts().filter(c => c.status === 'OPEN');
  contacts.sort((a, b) => {
    const aVal = a[sortBy] || '';
    const bVal = b[sortBy] || '';
    const cmp = String(aVal).localeCompare(String(bVal));
    return sortDir === 'desc' ? -cmp : cmp;
  });
  return contacts;
};

/**
 * Fetch open contact messages with pagination and sorting
 */
export const fetchOpenContactMsgsWithPaginationAndSort = async (
  pageNumber = 0,
  pageSize = 10,
  sortBy = 'createdAt',
  sortDir = 'asc'
) => {
  await delay();
  let contacts = getContacts().filter(c => c.status === 'OPEN');
  contacts.sort((a, b) => {
    const aVal = a[sortBy] || '';
    const bVal = b[sortBy] || '';
    const cmp = String(aVal).localeCompare(String(bVal));
    return sortDir === 'desc' ? -cmp : cmp;
  });
  const totalElements = contacts.length;
  const totalPages = Math.ceil(totalElements / pageSize);
  const start = pageNumber * pageSize;
  const content = contacts.slice(start, start + pageSize);
  return { content, totalElements, totalPages, number: pageNumber, size: pageSize };
};

/**
 * Fetch a single contact by ID
 */
export const fetchContactById = async (id) => {
  await delay();
  return getContacts().find(c => c.id === parseInt(id)) || null;
};

/**
 * Update contact status
 */
export const updateContactStatus = async (id, status) => {
  await delay();
  const contacts = getContacts();
  const idx = contacts.findIndex(c => c.id === parseInt(id));
  if (idx !== -1) {
    contacts[idx].status = status || 'CLOSED';
    saveContacts(contacts);
    return contacts[idx];
  }
  throw new Error('Contact not found');
};

/**
 * Delete a contact
 */
export const deleteContact = async (id) => {
  await delay();
  const contacts = getContacts().filter(c => c.id !== parseInt(id));
  saveContacts(contacts);
};
