import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { main } from './components/main';
import { retreiveRandomUser } from './components/user';
import { users } from './components/users';
ReactDOM.render(
    main(retreiveRandomUser(users)),
    document.getElementById('root')
);
export const body = (<body>
    <div id="root"></div>
    {/* scripts */}
    <script src="./index.ts"></script>
</body>);