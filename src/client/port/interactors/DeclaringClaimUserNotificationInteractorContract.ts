import type { UserNotificationContract } from "../UserNotification"
import type { UserNotificationInteractorContract } from "./UserNotificationInteractorContract"
export type DeclaringClaimNotificationType = "Declaring claim."
export interface DeclaringClaimUserNotificationInteractorContract extends UserNotificationInteractorContract {
    notify(userNotification: DeclaringClaimUserNotificationContract): void;
}
export interface DeclaringClaimUserNotificationContract extends UserNotificationContract {
    type:DeclaringClaimNotificationType
}
export const successDeclaringUserNotification:DeclaringClaimUserNotificationContract = {status:"Success", message:"Declared.",type:"Declaring claim."}