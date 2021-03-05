import type { UserNotificationContract } from '../UserNotification';
import type { UserNotificationInteractorContract } from './UserNotificationInteractorContract';
export interface SigningInUserNotificationInteractorContract extends UserNotificationInteractorContract {
    notify(userNotification: SigningInUserNotificationContract): void;
}
export interface SigningInUserNotificationContract extends UserNotificationContract {
    type:SigningInNotificationType
}
export type SigningInNotificationType="Signing In"
export const successSigningInNotification:SigningInUserNotificationContract = {status:"Success", message:"Signed In",type:"Signing In"}
export const alreadySignedInSigningInNotification:SigningInUserNotificationContract = {status:"Failed", message:"You are already signed in. Please signout.",type:"Signing In"}
export const badCredentialsSigningInNotification:SigningInUserNotificationContract = {status:"Failed", message:"Bad credentials. Please verify your credentials or register to Bangarang.",type:"Signing In"}