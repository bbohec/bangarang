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
export const successSearchingClaimsUserNotification=(retreivedClaims:ClaimContract[]):SearchingClaimsUserNotificationContract => ({status:"Success", message:`${retreivedClaims.length} claims found.`, type:"Searching Claims",retreivedClaims})
/*
export const claimNotDeclaredRetrievingClaimUserNotification:RetrievingClaimUserNotificationContract = ({status:"Failed", message:"The claim is not declared on Bangarang.",type:"Retrieving claim."})
*/