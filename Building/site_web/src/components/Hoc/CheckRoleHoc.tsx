import { AuthentifiedProps } from '../../types/Auth'
import PagesRole from '../../auth/pages.json';
import Unauthorized from '../../../pages/unauthorized';
import * as React from 'react';

export const CheckRoleHoc = <P extends AuthentifiedProps>(
    Component: React.ComponentType<P>
): React.ComponentType<P> => (props) => {
    if(Component.displayName && Object.keys(PagesRole).includes(Component.displayName)) {
        const allowedRole = PagesRole[Component.displayName];
        const hasRole = allowedRole.some((role: string) => props.roles.includes(role))
        
        if (!hasRole) {
            return <Unauthorized />;
        }
    }
    return <Component {...props as P} />
}
