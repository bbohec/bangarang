import {Writable, writable} from 'svelte/store'
import { ClaimingUserNotificationContract, idleClaimingUserNotification } from '../port/interactors/ClaimingUserNotificationInteractorContract'
export const claimingUserNotificationStore:Writable<ClaimingUserNotificationContract> = writable(idleClaimingUserNotification)

