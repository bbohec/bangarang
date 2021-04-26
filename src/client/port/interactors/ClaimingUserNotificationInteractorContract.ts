import type { UserNotificationInteractorContract } from "./UserNotificationInteractorContract";
import type { UserNotificationContract } from "../UserNotification";
import type { ClaimChoice } from "../ClaimChoice";
export type ClaimingNotificationType = "Claiming."
export interface ClaimingUserNotificationInteractorContract extends UserNotificationInteractorContract {
    notify(userNotification: ClaimingUserNotificationContract): void;
}
export interface ClaimingUserNotificationContract extends UserNotificationContract {
    type:ClaimingNotificationType
}
export const idleClaimingUserNotification:ClaimingUserNotificationContract= {status:"Idle", message:{en:`Waiting for claiming event.`,fr:`En attente de l'événementer revendiquer.`}, type:"Claiming."}
export const executingClaimingUserNotification:ClaimingUserNotificationContract= {status:"Executing", message:{en:`Executing claiming event.`,fr:`Revendication en cours.`}, type:"Claiming."}
export const successClaimingUserNotification:ClaimingUserNotificationContract= {status:"Success", message:{en:`Claimed.`,fr:`Revendiqué.`}, type:"Claiming."}
export const claimNotDeclaredClaimingUserNotification=(claimId:string):ClaimingUserNotificationContract => ({status:"Failed", message:{en:`The claim '${claimId}' is not declared on Bangarang.`,fr:`La revendication '${claimId}' n'est pas déclarée dans Bangarang.`}, type:"Claiming."})
export const mustBeSignedInClaimingUserNotification:ClaimingUserNotificationContract= {status:"Failed", message:{en:`You must be signed in in order to claim.`,fr:`Tu dois être connecté afin de pouvoir revendiquer.`}, type:"Claiming."}
export const multipleTimesClaimingUserNotification=(claimChoice:ClaimChoice):ClaimingUserNotificationContract=>({status:"Failed", message:{en:`Claiming '${claimChoice}' multiple times on a claim is forbidden.`,fr:`Revendiquer '${claimChoice}' plusieurs fois sur une revendication est interdit.`}, type:"Claiming."})
export const unexpectedErrorClaimingUserNotification=(error:Error):ClaimingUserNotificationContract=>({status:"Failed", message:{en:`Unexpected Error: '${error.message}'.`,fr:`Erreur inatendue: '${error.message}'.`}, type:"Claiming."})