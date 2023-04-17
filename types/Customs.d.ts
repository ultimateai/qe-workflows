import ReqUser from '../src/models/service/ReqUser.model';
import { ContextInterface } from '../src/models/interfaces/Context.interface';

declare global {
    namespace Express {
        interface Request {
            context: ContextInterface;
            user?: ReqUser;
        }
    }
}
