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
export const idleDeclaringClaimUserNotification:DeclaringClaimUserNotificationContract = {status:"Idle", message:{en:"Waiting for claim declaration event.",fr:`En attente d'événement de déclaration.`},type:"Declaring claim."}
export const executingDeclaringClaimUserNotification=(claimToDeclare:ClaimContract):DeclaringClaimUserNotificationContract => ({status:"Executing", message:{en:"Declaring claim...",fr:`Déclaration en cours...`},type:"Declaring claim.",claimToDeclare})
export const successDeclaringClaimUserNotification:DeclaringClaimUserNotificationContract = {status:"Success", message:{en:"Declared.",fr:`Déclaré.`},type:"Declaring claim."}
export const claimWithoutTitleDeclaringClaimUserNotification:DeclaringClaimUserNotificationContract = {status:"Failed", message:{en:"A claim must have a title.",fr:`Une revendication doit avoir un titre.`},type:"Declaring claim."}
export const claimWithoutTypeDeclaringClaimUserNotification:DeclaringClaimUserNotificationContract = {status:"Failed", message:{en:"A claim must have a type.",fr:`Une revendication doit avoir un type.`},type:"Declaring claim."}
export const claimAlreadyExistDeclaringClaimUserNotification = (claimTitle:string):DeclaringClaimUserNotificationContract => ({status:"Failed", message:{en:`The claim "${claimTitle}" already exist.`,fr:`La revendication "${claimTitle}" existe déjà.`},type:"Declaring claim."})
export const unexpectedErrorDeclaringClaimUserNotification = (error:Error):DeclaringClaimUserNotificationContract => ({status:"Failed", message:{en:`Unexpected error: "${error.message}".`,fr:`Erreur inatendue: "${error.message}".`},type:"Declaring claim."})


