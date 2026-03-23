import { openDB } from 'idb';

const DB_NAME = 'hbs-offline-db';
const STORE_NAME = 'queued-actions';

let dbPromise = null;

export async function initDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      }
    });
  }
  return dbPromise;
}

export async function queueAction(action) {
  const db = await initDB();
  await db.put(STORE_NAME, { id: action.id || Date.now(), ...action });
}

export async function getQueuedActions() {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
}

export async function clearQueuedAction(id) {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
}

export async function syncQueuedActions(handler) {
  const actions = await getQueuedActions();
  for (const a of actions) {
    try {
      await handler(a);
      await clearQueuedAction(a.id);
    } catch (e) {
      // leave it queued if handler fails
      console.warn('Failed to sync action', a, e);
    }
  }
}

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        console.log('Service worker registered:', reg.scope);
      } catch (e) {
        console.warn('Service worker registration failed:', e);
      }
    });
  }
}
