import type { BangarangAdaptersContract } from "../../port/BangarangAdaptersContract";
import type { ClaimContract } from "../../port/ClaimContract";
import type { Command, CommandName } from "../../port/Command";
import { successDeclaringClaimUserNotification, claimAlreadyExistDeclaringClaimUserNotification, claimWithoutTitleDeclaringClaimUserNotification, unexpectedErrorDeclaringClaimUserNotification } from "../../port/interactors/DeclaringClaimUserNotificationInteractorContract";
import { claimNotDeclaredRetrievingClaimUserNotification } from "../../port/interactors/RetrievingClaimUserNotificationInteractorContract";
import { Claim } from "../Claim";

export class DeclaringClaim implements Command{
    constructor (
        private bangarangAdapters:BangarangAdaptersContract,
        private claimToDeclare : ClaimContract|undefined
    ){}
    execute(): Promise<void> {
        if (this.claimToDeclare === undefined) {
            this.bangarangAdapters.declaringClaimUserNotificationInteractor.notify(unexpectedErrorDeclaringClaimUserNotification(new Error("Claim to declare is undefined.")))
            return Promise.resolve()
        }
        if (this.claimToDeclare.title === "") {
            this.bangarangAdapters.declaringClaimUserNotificationInteractor.notify(claimWithoutTitleDeclaringClaimUserNotification)
            return Promise.resolve()
        }
        const shouldSaveClaimWhenClaimDontExistByTitleUpperCase=(isClaimExistByTitleUpperCase:boolean,claimToDeclare:ClaimContract):Promise<boolean>=> {
            if (!isClaimExistByTitleUpperCase) return new Claim(claimToDeclare)
                .save(this.bangarangAdapters.bangarangClaimInteractor)
                .then(result=> {
                    if (result instanceof Error) throw new Error (`MISSIGN SPECS : ${result}`)
                    this.bangarangAdapters.declaringClaimUserNotificationInteractor.notify(successDeclaringClaimUserNotification)
                    return isClaimExistByTitleUpperCase
                })
            this.bangarangAdapters.declaringClaimUserNotificationInteractor.notify(claimAlreadyExistDeclaringClaimUserNotification(claimToDeclare.title))
            return Promise.resolve(isClaimExistByTitleUpperCase)
        }
        const claimToDeclare = this.claimToDeclare
        return this.bangarangAdapters.bangarangClaimInteractor.isClaimExistByTitleIncensitiveCase(claimToDeclare.title)
            .then(isClaimExistByTitleUpperCase => {
                if (isClaimExistByTitleUpperCase instanceof Error) throw isClaimExistByTitleUpperCase
                return shouldSaveClaimWhenClaimDontExistByTitleUpperCase(isClaimExistByTitleUpperCase,claimToDeclare)
            })
            .then(isClaimExistByTitleUpperCase => (isClaimExistByTitleUpperCase)?
                this.bangarangAdapters.bangarangClaimInteractor.claimByTitleIncencitiveCase(claimToDeclare.title):
                this.bangarangAdapters.bangarangClaimInteractor.claimById(claimToDeclare.id)
            )
            .then(claim => {
                if (claim instanceof Error) this.bangarangAdapters.retrievingClaimUserNotificationInteractor.notify(claimNotDeclaredRetrievingClaimUserNotification)
                else this.bangarangAdapters.bangarangUserInterfaceInteractor.goToClaim(claim.id)
            })
            .catch(error=>{
                console.warn (`Unhandled error : ${error}`)
            })
    }
    readonly name: CommandName = "Declaring Claim"
}