import type { UserNotificationContract } from '../UserNotification';
import type { UserNotificationInteractorContract } from './UserNotificationInteractorContract';
export interface RegisteringUserNotificationInteractorContract extends UserNotificationInteractorContract {
    notify(userNotification: RegisteringUserNotificationContract): void;
}
export interface RegisteringUserNotificationContract extends UserNotificationContract {
    type:RegisteringNotificationType
}
export type RegisteringNotificationType="Registering."
export const successRegisteringUserNotification:RegisteringUserNotificationContract = {status:"Success", message:"Registered.",type:"Registering."}
export const badEmailRegisteringUserNotification:RegisteringUserNotificationContract = {status:"Failed", message:"Email invalid.",type:"Registering."}
export const unsecurePasswordRegisteringUserNotification:RegisteringUserNotificationContract = {status:"Failed", message:"Unsecure password.",type:"Registering."}
export const alreadyMemberRegisteringUserNotification:RegisteringUserNotificationContract = {status:"Failed", message:"Already member of Bangarang.",type:"Registering."}