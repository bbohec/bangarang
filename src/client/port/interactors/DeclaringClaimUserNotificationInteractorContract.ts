import type { ClaimContract } from "../ClaimContract"
import type { UserNotificationContract } from "../UserNotification"
import type { UserNotificationInteractorContract } from "./UserNotificationInteractorContract"
export type DeclaringClaimNotificationType = "Declaring claim."
export interface DeclaringClaimUserNotificationInteractorContract extends UserNotificationInteractorContract {
    notify(userNotification: DeclaringClaimUserNotificationContract): void;
}
export interface DeclaringClaimUserNotificationContract extends UserNotificationContract {
    type:DeclaringClaimNotificationType
    claimToDeclare?:ClaimContract
}
export const idleDeclaringClaimUserNotification:DeclaringClaimUserNotificationContract = {status:"Idle", message:"Waiting for claim declaration event.",type:"Declaring claim."}
export const executingDeclaringClaimUserNotification=(claimToDeclare:ClaimContract):DeclaringClaimUserNotificationContract => ({status:"Executing", message:"Declaring claim...",type:"Declaring claim.",claimToDeclare})
export const successDeclaringClaimUserNotification:DeclaringClaimUserNotificationContract = {status:"Success", message:"Declared.",type:"Declaring claim."}
export const claimWithoutTitleDeclaringClaimUserNotification:DeclaringClaimUserNotificationContract = {status:"Failed", message:"A claim must have a title.",type:"Declaring claim."}
export const claimWithoutTypeDeclaringClaimUserNotification:DeclaringClaimUserNotificationContract = {status:"Failed", message:"A claim must have a type.",type:"Declaring claim."}
export const claimAlreadyExistDeclaringClaimUserNotification = (claimTitle:string):DeclaringClaimUserNotificationContract => ({status:"Failed", message:`The claim "${claimTitle}" already exist`,type:"Declaring claim."})


