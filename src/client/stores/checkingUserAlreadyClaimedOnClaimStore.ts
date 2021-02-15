import {Writable, writable} from 'svelte/store'
import type { CheckingIfUserAlreadyClaimedOnClaim } from '../interfaces/CheckingIfUserAlreadyClaimedOnClaim'
export const checkingIfUserAlreadyClaimedOnClaimStore:Writable<CheckingIfUserAlreadyClaimedOnClaim> = writable({checkingStatus:"idle"})