import {writable} from 'svelte/store'
const initialClaimSearchValue:string = 'a'
export const claimSearchStore = writable(initialClaimSearchValue)