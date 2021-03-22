import {Writable, writable} from 'svelte/store'
import { idleSigningInNotification, SigningInUserNotificationContract } from '../port/interactors/SigningInUserNotificationInteractorContract'
export const signingInNotificationStore:Writable<SigningInUserNotificationContract> = writable(idleSigningInNotification)

