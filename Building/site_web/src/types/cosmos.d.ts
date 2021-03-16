export interface RequestList {
    [key: string]: Request
}

export interface Request {
    lastRequest: Date;
    lastValues: any;
    [key: string]: any;
}