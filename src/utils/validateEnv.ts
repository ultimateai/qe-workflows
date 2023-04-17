import { cleanEnv, port, str } from 'envalid';

function validateEnv(): void {
    cleanEnv(process.env, {
        APP_ENV: str(),
        APP_NAME: str(),
        NODE_ENV: str(),
        DASHBOARD_BE_URL: str(),
        MONGO_USER: str(),
        MONGO_HOST: str(),
        MONGO_DATABASE: str(),
        PORT: port()
    });
}

export default validateEnv;
