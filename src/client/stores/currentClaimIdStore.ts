import {Writable, writable} from 'svelte/store'
export const currentClaimIdStore:Writable<string|undefined> = writable(undefined)