import axios from 'axios';
import ReqUser from '../models/service/ReqUser.model';

class PermissionsServiceClient {
    private instance = axios.create({ baseURL: process.env.PERMISSIONS_SERVICE_URL });

    public async getCurrentUser(authorization: string): Promise<ReqUser | undefined> {
        const response = await this.instance.post('/getCurrentUser', {}, { headers: { authorization } });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const user = response.data?.user;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return user ? new ReqUser(user) : undefined;
    }
}

export default PermissionsServiceClient;
