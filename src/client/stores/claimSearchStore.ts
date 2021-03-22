import {writable} from 'svelte/store'
const initialClaimSearchValue:string = ''
export const claimSearchCriteriaStore = writable(initialClaimSearchValue)
