// Creates a database in IndexedDB to store pending tests
function openDatabase(participantId: string): Promise<IDBDatabase> {
    if (!('indexedDB' in window)) {
        console.warn("This browser doesn't support IndexedDB.");
        return Promise.reject();
    }

    return new Promise((resolve, reject) => {
        const request: IDBOpenDBRequest = indexedDB.open('proof-pends-database', 1);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(participantId)) {
                db.createObjectStore(participantId, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event: Event) => {
            resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onerror = (event: Event) => {
            reject((event.target as IDBOpenDBRequest).error);
        };
    });
}

// Store a pending test in IndexedDB
export async function storeBlobInIndexedDB(blob: Blob, participantId: string): Promise<number | void> {
    try {
        const db: IDBDatabase = await openDatabase(participantId);
        const transaction: IDBTransaction = db.transaction([participantId], 'readwrite');
        const objectStore: IDBObjectStore = transaction.objectStore(participantId);

        return new Promise((resolve, reject) => {
            const request: IDBRequest<IDBValidKey> = objectStore.add({ blob });

            request.onsuccess = (event: Event) => {
                console.log('Blob stored successfully');
                resolve((event.target as IDBRequest).result as number);
            };

            request.onerror = (event: Event) => {
                console.error('Error storing blob:', (event.target as IDBRequest).error);
                reject((event.target as IDBRequest).error);
            };
        });
    } catch (error) {
        console.error('Database error:', error);
    }
}


// Retrieves a pending test from IndexedDB
export async function retrieveBlobFromIndexedDB(id: number, participantId: string): Promise<Blob | null> {
    try {
        const db: IDBDatabase = await openDatabase(participantId);
        const transaction: IDBTransaction = db.transaction([participantId], 'readonly');
        const objectStore: IDBObjectStore = transaction.objectStore(participantId);

        return new Promise((resolve, reject) => {
            const request: IDBRequest<any> = objectStore.get(id);

            request.onsuccess = (event: Event) => {
                const result = (event.target as IDBRequest).result;
                if (result) {
                    resolve(result.blob);
                } else {
                    resolve(null);
                }
            };

            request.onerror = (event: Event) => {
                reject((event.target as IDBRequest).error);
            };
        });
    } catch (error) {
        console.error('Database error:', error);
        return null;
    }
}

// Deletes a pending test
export async function deleteBlobFromIndexedDB(id: number, participantId: string): Promise<void> {
    try {
        const db: IDBDatabase = await openDatabase(participantId);
        const transaction: IDBTransaction = db.transaction([participantId], 'readwrite');
        const objectStore: IDBObjectStore = transaction.objectStore(participantId);

        return new Promise<void>((resolve, reject) => {
            const request: IDBRequest = objectStore.delete(id);

            request.onsuccess = () => {
                console.log('Blob deleted successfully');
                resolve();
            };

            request.onerror = (event: Event) => {
                console.error('Error deleting blob:', (event.target as IDBRequest).error);
                reject((event.target as IDBRequest).error);
            };
        });
    } catch (error) {
        console.error('Database error:', error);
    }
};

//Check if a database and object store exist
export function checkDatabaseAndObjectStore(participantId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('proof-pends-database');

        request.onerror = (event) => {
            console.error('Database error:', event);
            reject(false);
        };

        request.onsuccess = (event) => {
            const db = request.result;
            const objectStoreNames = Array.from(db.objectStoreNames);

            // Check if the object store exists
            const storeExists = objectStoreNames.includes(participantId);

            db.close();
            resolve(storeExists);
        };
    });
}

// Delete Database function: not used within the app, but useful for testing
export function deleteDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
        const request: IDBOpenDBRequest = indexedDB.deleteDatabase('proof-pends-database');

        request.onsuccess = () => {
            console.log('Database deleted successfully');
            resolve();
        };

        request.onerror = (event: Event) => {
            console.error('Error deleting database:', (event.target as IDBRequest).error);
            reject((event.target as IDBRequest).error);
        };

        request.onblocked = () => {
            console.log('Database deletion blocked');
        };
    });
}
