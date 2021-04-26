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
export const idleRetrievingClaimUserNotification:RetrievingClaimUserNotificationContract = {status:"Idle", message:{en:"Waiting for retrieving claim event.",fr:`En attente d'événement de récupération de revendication.`},type:"Retrieving claim."}
export const executingRetrievingClaimUserNotification:RetrievingClaimUserNotificationContract = {status:"Executing", message:{en:"Retrieving claim...",fr:`Récupération de revendication en cours...`},type:"Retrieving claim."}
export const successRetrievingClaimUserNotification=(claim:ClaimContractWithMemberPreviousClaimChoice):RetrievingClaimUserNotificationContract => ({status:"Success", message:{en:"Claim retrieved.",fr:`Revendication récupérée.`},type:"Retrieving claim.",claimWithMemberPreviousClaimChoice: claim})
export const claimNotDeclaredRetrievingClaimUserNotification:RetrievingClaimUserNotificationContract = ({status:"Failed", message:{en:"The claim is not declared on Bangarang.",fr:`La revendication n'est pas déclarée sur Bangarang.`},type:"Retrieving claim."})
export const unexpectedErrorRetrievingClaimUserNotification=(error:Error):RetrievingClaimUserNotificationContract => ({status:"Failed", message:{en:`Unexpected Error: '${error.message}'.`,fr:`Erreur inatendue: '${error.message}'`},type:"Retrieving claim."})