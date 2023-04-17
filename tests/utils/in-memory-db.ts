import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

let replSet: MongoMemoryReplSet;

/**
 * Connect to the in-memory database.
 */
export const connect = async (): Promise<void> => {
    replSet = await MongoMemoryReplSet.create({
        instanceOpts: [{ storageEngine: 'wiredTiger' }, { storageEngine: 'wiredTiger' }],
        replSet: {
            configSettings: {
                electionTimeoutMillis: 2000
            }
        }
    });
    const replUri = replSet.getUri();

    await mongoose.connect(replUri, {});
};

/**
 * Drop database, close the connection and stop mongod.
 */
export const closeDatabase = async (): Promise<void> => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await replSet.stop();
};

/**
 * Remove all the data for all db collections.
 */
export const clearDatabase = async (): Promise<void> => {
    const { collections } = mongoose.connection;

    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const key of Object.keys(collections)) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
};
