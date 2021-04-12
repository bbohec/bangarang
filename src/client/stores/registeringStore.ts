import {Writable, writable} from 'svelte/store'
import { idleMemberRegisteringUserNotification, RegisteringUserNotificationContract } from '../port/interactors/RegisteringUserNotificationInteractorContract'
export const registeringUserNotificationStore:Writable<RegisteringUserNotificationContract> = writable(idleMemberRegisteringUserNotification)

