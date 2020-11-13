import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { main } from './components/main';
import { retrieveUser } from './components/retrieveUser';
import { defineCurrentIndividual } from './components/defineCurrentIndividual';
import { fakeBangarang } from '../adapters/primary/fakeBangarang';
ReactDOM.render(
    main(retrieveUser(fakeBangarang,defineCurrentIndividual())),
    document.getElementById('root')
);
export const body = (<body>
    <div id="root"></div>
    {/* scripts */}
    <script src="./index.ts"></script>
</body>);


