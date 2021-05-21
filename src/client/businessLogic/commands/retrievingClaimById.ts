import type { BangarangAdaptersContract } from "../../port/BangarangAdaptersContract";
import type { ClaimContract, ClaimContractWithMemberPreviousClaimChoice } from "../../port/ClaimContract";
import type { Command, CommandName } from "../../port/Command";
import { claimNotDeclaredRetrievingClaimUserNotification, unexpectedErrorRetrievingClaimUserNotification, successRetrievingClaimUserNotification, RetrievingClaimUserNotificationContract } from "../../port/interactors/RetrievingClaimUserNotificationInteractorContract";
export class RetrievingClaimById implements Command {
    constructor(
        private bangarangAdapters:BangarangAdaptersContract,
        private claimId:string|undefined
    ){}
    execute(): Promise<void> {
        if(this.claimId === undefined) {
            this.bangarangAdapters.retrievingClaimUserNotificationInteractor.notify(unexpectedErrorRetrievingClaimUserNotification(new Error("claimId is undefined.")))
            return Promise.resolve()
        }
        let claim:ClaimContract
        return this.bangarangAdapters.bangarangClaimInteractor.claimById(this.claimId)
            .then(claimById => {
                if (claimById instanceof Error)  throw (claimNotDeclaredRetrievingClaimUserNotification)
                claim = claimById;
                const signedInUserContract = this.bangarangAdapters.bangarangUserInterfaceInteractor.retrieveSignedInUserContract()
                return (signedInUserContract === undefined)?undefined:this.bangarangAdapters.bangarangMembersInteractor.retrievePreviousMemberClaimChoiceOnClaim(signedInUserContract.username, claim.id)
            })
            .then(previousMemberClaimChoiceOnClaim => {
                if(previousMemberClaimChoiceOnClaim instanceof Error) throw unexpectedErrorRetrievingClaimUserNotification(previousMemberClaimChoiceOnClaim)
                else {
                    const claimWithMemberPreviousClaimChoice:ClaimContractWithMemberPreviousClaimChoice = {
                        title:claim.title,
                        type:claim.type,
                        peopleClaimed:claim.peopleClaimed,
                        peopleClaimedAgainst:claim.peopleClaimedAgainst,
                        peopleClaimedFor:claim.peopleClaimedFor,
                        previousUserClaimChoice:previousMemberClaimChoiceOnClaim,
                        id:claim.id
                    }
                    this.bangarangAdapters.retrievingClaimUserNotificationInteractor.notify(successRetrievingClaimUserNotification(claimWithMemberPreviousClaimChoice))
                }
            })
            .catch((notification:RetrievingClaimUserNotificationContract)=>this.bangarangAdapters.retrievingClaimUserNotificationInteractor.notify(notification))
    }
    readonly name: CommandName = "Retrieving Claim By Id"
}