import mongoose from 'mongoose';
import { logger } from '../utils/Logger.util';

export class DatabaseClient {
    public async connectToDatabase(): Promise<void> {
        const username = process.env.MONGO_USER || 'app';
        const password = process.env.MONGO_PASSWORD;
        const host = process.env.MONGO_HOST;
        const db = process.env.MONGO_DATABASE;
        const params = process.env.MONGO_PARAMS;

        const mongoUrl = `mongodb+srv://${host}/${db}?${params}`;
        logger.info(`Connecting to atlas: ${mongoUrl}`);

        await mongoose
            .connect(mongoUrl, {
                user: username,
                pass: password,
                autoIndex: false
            })
            .then(() => logger.info('Connected successfully to database.'))
            .catch((err) => logger.error(`Error connecting to database`, err));
    }

    public isDbConnectionReady(): boolean {
        return mongoose.connection.readyState === 1;
    }
}

export default new DatabaseClient();
