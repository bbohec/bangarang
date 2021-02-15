import {Writable, writable} from 'svelte/store'
import type { ConnectedUser } from '../interfaces/ConnectedUser';
export const connectedUserStore:Writable<ConnectedUser|null>= writable(null);

