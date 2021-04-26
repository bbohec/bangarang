import type { UserNotificationInteractorContract } from "./UserNotificationInteractorContract";
import type { UserNotificationContract } from "../UserNotification";
import type { ClaimContract, ClaimContractWithMemberPreviousClaimChoice } from "../ClaimContract";
export type RetrievingClaimNotificationType = "Retrieving claim."
export interface SearchingClaimsUserNotificationInteractorContract extends UserNotificationInteractorContract {
    notify(userNotification: SearchingClaimsUserNotificationContract): void;
}
export interface SearchingClaimsUserNotificationContract extends UserNotificationContract {
    type:SearchingClaimsNotificationType
    retreivedClaims?:ClaimContract[]
}
export type SearchingClaimsNotificationType="Searching Claims"
export const executingSearchingClaimsUserNotification:SearchingClaimsUserNotificationContract ={status:"Executing", message:{en:`Searching claims...`,fr:`Recherche de revendications en cours...`}, type:"Searching Claims"}
export const idleSearchingClaimsUserNotification:SearchingClaimsUserNotificationContract ={status:"Idle", message:{en:`Waiting for searching claims event.`,fr:`En attente d'événement de recherche de revendication.`}, type:"Searching Claims"}
export const successSearchingClaimsUserNotification=(retreivedClaims:ClaimContract[]):SearchingClaimsUserNotificationContract => ({status:"Success", message:{en:`${retreivedClaims.length} claims found.`,fr:`${retreivedClaims.length} revendications trouvées.`}, type:"Searching Claims",retreivedClaims})
export const unexpectedErrorSearchingClaimsUserNotification=(error:Error):SearchingClaimsUserNotificationContract => ({status:"Failed", message:{en:`Unexpected error '${error.message}'.`,fr:`Erreur innatendue: '${error.message}'`}, type:"Searching Claims"})
/*
export const claimNotDeclaredRetrievingClaimUserNotification:RetrievingClaimUserNotificationContract = ({status:"Failed", message:"The claim is not declared on Bangarang.",type:"Retrieving claim."})
*/