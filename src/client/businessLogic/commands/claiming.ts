import type { BangarangAdaptersContract } from "../../port/BangarangAdaptersContract";
import type { ClaimChoice } from "../../port/ClaimChoice";
import type { Command, CommandName } from "../../port/Command";
import { mustBeSignedInClaimingUserNotification, claimNotDeclaredClaimingUserNotification, unexpectedErrorClaimingUserNotification, multipleTimesClaimingUserNotification, successClaimingUserNotification, ClaimingUserNotificationContract } from "../../port/interactors/ClaimingUserNotificationInteractorContract";
import { Claim } from "../entities/Claim";

export class Claiming implements Command {
    constructor(
        private readonly bangarangAdapters: BangarangAdaptersContract,
        private readonly claimId:string|undefined,
        private readonly claimChoice:ClaimChoice|undefined,
    ){}
    execute(): Promise<void> {
        if(this.claimId === undefined){
            this.bangarangAdapters.claimingUserNotificationInteractor.notify(unexpectedErrorClaimingUserNotification(new Error('claimId is undefined.')))
            return Promise.resolve()
        }
        if(this.claimChoice === undefined){
            this.bangarangAdapters.claimingUserNotificationInteractor.notify(unexpectedErrorClaimingUserNotification(new Error('claimChoice is undefined.')))
            return Promise.resolve()
        }
        const userContract = this.bangarangAdapters.bangarangUserInterfaceInteractor.retrieveSignedInUserContract()
        if(userContract === undefined) {
            this.bangarangAdapters.bangarangUserInterfaceInteractor.goToSigningInMenu()
            this.bangarangAdapters.claimingUserNotificationInteractor.notify(mustBeSignedInClaimingUserNotification)
            return Promise.resolve()
        }
            const claimId=this.claimId
            const claimChoice = this.claimChoice
            return Promise.all([
                this.bangarangAdapters.bangarangClaimInteractor.claimById(this.claimId),
                this.bangarangAdapters.bangarangMembersInteractor.retrievePreviousMemberClaimChoiceOnClaim(userContract.username, claimId)
            ])
            .then(([retreivedClaim,previousClaimChoice])=> {
                const isUserHasPreviouslyMadeTheSameClaimChoice=(previousClaimChoice:ClaimChoice,claimChoice:ClaimChoice):boolean => previousClaimChoice !==undefined && previousClaimChoice === claimChoice
                if (retreivedClaim instanceof Error) throw claimNotDeclaredClaimingUserNotification(claimId)
                if (previousClaimChoice instanceof Error) throw unexpectedErrorClaimingUserNotification(previousClaimChoice)
                else if (isUserHasPreviouslyMadeTheSameClaimChoice(previousClaimChoice,claimChoice))throw multipleTimesClaimingUserNotification(claimChoice)
                return new Claim(retreivedClaim)
                    .increasePeopleClaimedWhenNoPreviousClaimChoice(previousClaimChoice)
                    .removePreviousClaimOnClaim(previousClaimChoice)
                    .increaseClaimChoiseFromClaimChoice(claimChoice)
                    .claiming(this.bangarangAdapters.bangarangClaimInteractor,this.bangarangAdapters.bangarangMembersInteractor,userContract.username,claimChoice)
            })
            .then(claimingResult=> {
                if(claimingResult instanceof Error) throw unexpectedErrorClaimingUserNotification(claimingResult)
                this.bangarangAdapters.claimingUserNotificationInteractor.notify(successClaimingUserNotification)
            })
            .catch((notification:ClaimingUserNotificationContract) => this.bangarangAdapters.claimingUserNotificationInteractor.notify(notification))
    }
    readonly name:CommandName= "Claiming";
}