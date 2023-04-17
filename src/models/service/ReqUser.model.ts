/* eslint-disable no-shadow */
import HttpError from '../../errors/HttpError';

export const UL_EXTENDED_ADMIN_ROLES = ['admin', 'customerSuccessManager', 'partner'];
export const UL_ADMIN_ROLES = ['admin', 'customerSuccessManager'];

export enum RoleLevels {
    ADMIN_ROLES,
    EXTENDED_ADMIN_ROLES,
    AUTHENTICATED_USER
}

type User = {
    _id: string;
    email: string;
    role: string;
    organizationIds: string[];
    accessibleBotIds: string[];
};

export default class ReqUser {
    readonly _id: string;
    readonly email: string;
    readonly role: string;
    readonly organizationIds: string[];
    readonly accessibleBotIds: string[];
    readonly isAdmin: boolean;

    constructor(user: User) {
        this._id = user._id;
        this.email = user.email;
        this.role = user.role;
        this.organizationIds = user.organizationIds;
        this.accessibleBotIds = user.accessibleBotIds;
        this.isAdmin = UL_ADMIN_ROLES.includes(this.role);
    }

    validateUserAccess(level: RoleLevels, ownerIds: string[] = []): void {
        if ((level || ownerIds.length > 0) && !this._id) {
            throw new HttpError(403, 'FORBIDDEN');
        }
        if (UL_ADMIN_ROLES.includes(this.role)) {
            return;
        }
        if (level === RoleLevels.EXTENDED_ADMIN_ROLES && !UL_EXTENDED_ADMIN_ROLES.includes(this.role)) {
            throw new HttpError(403, 'FORBIDDEN');
        }
        if (ownerIds.length > 0) {
            if (!ownerIds.every((ownerId) => this.accessibleBotIds.includes(ownerId))) {
                throw new HttpError(403, 'FORBIDDEN');
            }
        }
    }
}
