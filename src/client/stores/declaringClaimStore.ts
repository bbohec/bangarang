import {Writable, writable} from 'svelte/store'
import type { DeclaringClaimConstract } from '../interfaces/DeclaringClaimConstract'
export const declaringClaimStore:Writable<DeclaringClaimConstract> = writable({declaringClaimStatus:"nothing"})


