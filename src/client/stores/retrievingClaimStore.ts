import {Writable, writable} from 'svelte/store'
import { idleRetrievingClaimUserNotification, RetrievingClaimUserNotificationContract } from '../port/interactors/RetrievingClaimUserNotificationInteractorContract'
export const retrievingClaimUserNotificationStore:Writable<RetrievingClaimUserNotificationContract> = writable(idleRetrievingClaimUserNotification)