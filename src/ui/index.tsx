import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { main } from './components/main';
import { retrieveUser } from './components/retrieveUser';
import { defineCurrentIndividual } from './components/defineCurrentIndividual';
import { uiBangarang } from './uiBangarang';
ReactDOM.render(
    main(retrieveUser(uiBangarang,defineCurrentIndividual())),
    document.getElementById('root')
);
export const body = (<body>
    <div id="root"></div>
    {/* scripts */}
    <script src="./index.ts"></script>
</body>);


