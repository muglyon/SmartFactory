import { Router } from 'next/router';
import { IProfile } from 'passport-azure-ad';

export interface User extends IProfile, Express.User {
    roles: string[];
}

export interface AuthentifiedProps {
    roles: string[];
    userName: string;
    router: Router;
}