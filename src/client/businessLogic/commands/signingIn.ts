import type { BangarangAdaptersContract } from "../../port/BangarangAdaptersContract";
import type { Command, CommandName } from "../../port/Command";
import { alreadySignedInSigningInNotification, badCredentialsSigningInNotification, successSigningInNotification, SigningInUserNotificationContract, unexpectedErrorSigningInNotification } from "../../port/interactors/SigningInUserNotificationInteractorContract";
export class SigningIn implements Command {
    constructor(
        private bangarangAdapters:BangarangAdaptersContract,
        private username:string|undefined,
        private password:string|undefined
    ){}
    execute(): Promise<void> {
        if(this.username === undefined) {
            this.bangarangAdapters.signingInUserNotificationInteractor.notify(unexpectedErrorSigningInNotification(new Error("Username is undefined.")))
            return Promise.resolve()
        }
        const username = this.username
        if(this.password === undefined) {
            this.bangarangAdapters.signingInUserNotificationInteractor.notify(unexpectedErrorSigningInNotification(new Error("Password is undefined")))
            return Promise.resolve()
        }
        const password = this.password
        const signedInUserContract = this.bangarangAdapters.bangarangUserInterfaceInteractor.retrieveSignedInUserContract()
        if(signedInUserContract !== undefined) {
            this.bangarangAdapters.signingInUserNotificationInteractor.notify(alreadySignedInSigningInNotification)
            return Promise.resolve()
        } else {
            return this.bangarangAdapters.bangarangMembersInteractor.isCredentialsValid({username,password})
            .then(isCredentialsValid=>{
                if (isCredentialsValid instanceof Error) throw isCredentialsValid
                if (isCredentialsValid === false) throw(badCredentialsSigningInNotification)
                return this.bangarangAdapters.bangarangMembersInteractor.retrieveUserContract(username)
            })
            .then(userContract=> {
                if (userContract instanceof Error) throw userContract
                this.bangarangAdapters.bangarangUserInterfaceInteractor.applySignedInUserContract(userContract)
                if(userContract === undefined) this.bangarangAdapters.signingInUserNotificationInteractor.notify(badCredentialsSigningInNotification)
                else this.bangarangAdapters.signingInUserNotificationInteractor.notify(successSigningInNotification)
            })
            .catch((notification:SigningInUserNotificationContract|Error)=>{
                if(notification instanceof Error) console.warn (`Unhandled error : ${notification}`)
                else this.bangarangAdapters.signingInUserNotificationInteractor.notify(notification)
            })
        }
    }
    readonly name: CommandName = "Signing In"
    
}