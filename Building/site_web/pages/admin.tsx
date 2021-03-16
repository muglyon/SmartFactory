import { NextPage } from 'next';
import { CheckRoleHoc } from '../src/components/Hoc/CheckRoleHoc';
import { AuthentifiedProps } from '../src/types/Auth';

const AdminPage: NextPage<AuthentifiedProps> = () => {
  
    return <div className="card p-4">
        <div className="card-header d-flex flex-align-center">
            <h4>Administration - Smartfactory</h4>
        </div>
        <div>
            <h3>Résolution : 3840 x 2160</h3>
            <h3>16/7 : 65 pouces</h3>
            <br />
            <h3> Site UX: <a href="https://xd.adobe.com/view/a0814a92-8315-486e-6919-82930e76dd0b-d6b0"> https://xd.adobe.com/view/a0814a92-8315-486e-6919-82930e76dd0b-d6b0 </a> </h3>
            <br />
            <h3> Specs anonymisees :  <a href="https://1drv.ms/p/s!Ai3-c1e5c9RWgdtVWidOLIgDZ4GthQ?e=LZ8wsb"> https://1drv.ms/p/s!Ai3-c1e5c9RWgdtVWidOLIgDZ4GthQ?e=LZ8wsb </a>  </h3>
        </div>
        <div className="card-content p-2" >
        </div>
    </div>
}

AdminPage.displayName = "admin"

export default CheckRoleHoc(AdminPage);
