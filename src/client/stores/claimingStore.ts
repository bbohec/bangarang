import {Writable, writable} from 'svelte/store'
import type { ClaimingContract } from '../interfaces/ClaimingContract'
export const claimingStore:Writable<ClaimingContract> = writable({claimingStatus:"nothing"})

