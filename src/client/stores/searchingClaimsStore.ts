import {Writable, writable} from 'svelte/store'
import { idleSearchingClaimsUserNotification, SearchingClaimsUserNotificationContract } from '../port/interactors/SearchingClaimsUserNotificationInteractorContract'
export const searchingClaimsUserNotificationStore:Writable<SearchingClaimsUserNotificationContract> = writable(idleSearchingClaimsUserNotification)