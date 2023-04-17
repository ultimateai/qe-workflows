import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { logger } from '../utils/Logger.util';

class DashboardClient {
    // example request to dashboard
    public async checkIfMessageIsAnnotated(messageText: string, ownerId: string): Promise<string | null> {
        try {
            logger.info(`Dashboard request: Check if ${messageText} for owner ${ownerId} is annotated`);
            const body = {
                messageText,
                ownerId
            };
            const response = await this._post('/api/getIntentForAnnotatedText', body);
            return response.data.intentId as string;
        } catch (err: any) {
            if (err.response?.status !== 404) {
                logger.error('Failed to check intent in dashboard', err.message);
            }
            return null;
        }
    }

    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/explicit-module-boundary-types
    public async _post(url: string, body: any): Promise<any | null> {
        const { JWT_SECRET } = process.env;

        const token = jwt.sign({}, JWT_SECRET || '', { expiresIn: '60s' });
        const authenticationHeader = { headers: { Authorization: token } };
        const response = await axios.post(`${process.env.DASHBOARD_BE_URL}${url}`, body, authenticationHeader);
        return response;
    }
}

export default DashboardClient;
