import {writable} from 'svelte/store'
const initialClaimSearchValue:string = ''
export const claimSearchStore = writable(initialClaimSearchValue)
