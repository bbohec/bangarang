import {Writable, writable} from 'svelte/store'
import { DeclaringClaimUserNotificationContract, idleDeclaringClaimUserNotification } from '../port/interactors/DeclaringClaimUserNotificationInteractorContract'
export const declaringClaimUserNotificationStore:Writable<DeclaringClaimUserNotificationContract> = writable(idleDeclaringClaimUserNotification)