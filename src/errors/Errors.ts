export class NotFoundError extends Error {
    code = 404;
    constructor(message?: string) {
        super(message || 'Entity not found.');
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class CatNotFoundError extends NotFoundError {
    constructor(catId: string) {
        super(`Cat with id ${catId} not found.`);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class CatUpdateError extends Error {
    code = 500;
    constructor(catId: string) {
        super(`Cat with id ${catId} couldn't be updated`);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export class CatDeleteError extends Error {
    code = 500;
    constructor(catId: string) {
        super(`Cat with id ${catId} couldn't be deleted`);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class CatCreateError extends Error {
    code = 500;
    constructor(catId: string) {
        super(`Cat with id ${catId} couldn't be created`);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
