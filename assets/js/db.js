// assets/js/db.js

const DB_NAME = 'MeditrackDB'; // <-- This was the missing line!
const DB_VERSION = 1;

const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            // Store for User accounts
            if (!db.objectStoreNames.contains('users')) {
                db.createObjectStore('users', { keyPath: 'email' });
            }
            // Store for Health Records
            if (!db.objectStoreNames.contains('records')) {
                db.createObjectStore('records', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// Helper to save a record
const saveToDB = async (storeName, data) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
};

// Helper to get data
const getFromDB = async (storeName, key) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// Helper to get all records for the active user
const getUserRecords = async (userEmail) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('records', 'readonly');
        const store = transaction.objectStore('records');
        const request = store.getAll();

        request.onsuccess = () => {
            // Filter records to only show those belonging to the active user
            const results = request.result.filter(rec => rec.userEmail === userEmail);
            // Sort by date: Newest records first
            resolve(results.sort((a, b) => new Date(b.date) - new Date(a.date)));
        };
        request.onerror = () => reject(request.error);
    });
};