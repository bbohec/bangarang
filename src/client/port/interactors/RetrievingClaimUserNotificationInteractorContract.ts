import type { UserNotificationInteractorContract } from "./UserNotificationInteractorContract";
import type { UserNotificationContract } from "../UserNotification";
import type { ClaimContractWithMemberPreviousClaimChoice } from "../ClaimContract";
export type RetrievingClaimNotificationType = "Retrieving claim."
export interface RetrievingClaimUserNotificationInteractorContract extends UserNotificationInteractorContract {
    notify(userNotification: RetrievingClaimUserNotificationContract): void;
}
export interface RetrievingClaimUserNotificationContract extends UserNotificationContract {
    type:RetrievingClaimNotificationType,
    claimWithMemberPreviousClaimChoice?:ClaimContractWithMemberPreviousClaimChoice
}
export const idleRetrievingClaimUserNotification:RetrievingClaimUserNotificationContract = {status:"Idle", message:"Waiting for retrieving claim event.",type:"Retrieving claim."}
export const executingRetrievingClaimUserNotification:RetrievingClaimUserNotificationContract = {status:"Executing", message:"Waiting for retrieving claim event.",type:"Retrieving claim."}
export const successRetrievingClaimUserNotification=(claim:ClaimContractWithMemberPreviousClaimChoice):RetrievingClaimUserNotificationContract => ({status:"Success", message:"Claim retrieved.",type:"Retrieving claim.",claimWithMemberPreviousClaimChoice: claim})
export const claimNotDeclaredRetrievingClaimUserNotification:RetrievingClaimUserNotificationContract = ({status:"Failed", message:"The claim is not declared on Bangarang.",type:"Retrieving claim."})
export const unexpectedErrorRetrievingClaimUserNotification=(error:Error):RetrievingClaimUserNotificationContract => ({status:"Failed", message:`Unexpected Error: '${error.message}'.`,type:"Retrieving claim."})