import {Writable, writable} from 'svelte/store'
import { uiBangarangUserBuilder } from '../adapters/uiPrimaryAdapter'
import type { UserContract } from '../port/UserContact'
export const currentUserContractStore:Writable<UserContract|undefined> = writable(uiBangarangUserBuilder.getUser().retrieveUserContract())