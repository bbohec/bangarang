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
export const idleClaimingUserNotification:ClaimingUserNotificationContract= {status:"Idle", message:`Wainting for claiming event.`, type:"Claiming."}
export const executingClaimingUserNotification:ClaimingUserNotificationContract= {status:"Executing", message:`Executing claiming event.`, type:"Claiming."}
export const successClaimingUserNotification:ClaimingUserNotificationContract= {status:"Success", message:`Claimed.`, type:"Claiming."}
export const claimNotDeclaredClaimingUserNotification=(claimId:string):ClaimingUserNotificationContract => ({status:"Failed", message:`The claim '${claimId}' is not declared on Bangarang.`, type:"Claiming."})
export const mustBeSignedInClaimingUserNotification:ClaimingUserNotificationContract= {status:"Failed", message:`You must be signed in in order to claim.`, type:"Claiming."}
export const multipleTimesClaimingUserNotification=(claimChoice:ClaimChoice):ClaimingUserNotificationContract=>({status:"Failed", message:`Claiming '${claimChoice}' multiple times on a claim is forbidden.`, type:"Claiming."})
export const unexpectedErrorClaimingUserNotification=(error:Error):ClaimingUserNotificationContract=>({status:"Failed", message:`Unexpected Error: '${error.message}'.`, type:"Claiming."})