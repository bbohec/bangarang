import type { BangarangAdaptersContract } from "../../port/BangarangAdaptersContract";
import type { Command, CommandName } from "../../port/Command";
import { alreadyMemberRegisteringUserNotification, badEmailRegisteringUserNotification, RegisteringUserNotificationContract, successRegisteringUserNotification, unexpectedErrorRegisteringUserNotification, unsecurePasswordRegisteringUserNotification } from "../../port/interactors/RegisteringUserNotificationInteractorContract";
import type { UserContract } from "../../port/UserContact";

export class Registering implements Command {
    constructor(readonly bangarangAdapters:BangarangAdaptersContract,private userContract:UserContract|undefined, private password:string|undefined){}
    execute(): Promise<void> {
        if(this.userContract === undefined) {
            this.bangarangAdapters.registeringUserNotificationInteractor.notify(unexpectedErrorRegisteringUserNotification(new Error("userContract is undefined.")))
            return Promise.resolve()
        }
        else if(this.password === undefined) {
            this.bangarangAdapters.registeringUserNotificationInteractor.notify(unexpectedErrorRegisteringUserNotification(new Error("password is undefined.")))
            return Promise.resolve()
        }
        else {
            const userContract = this.userContract
            const password = this.password
            return this.bangarangAdapters.bangarangMembersInteractor.isMemberExistWithUsername(userContract.username)
            .then(isMemberExistWithUsername => {
                if(isMemberExistWithUsername instanceof Error) throw new Error("NOT IMPLEMENTED")
                if(isMemberExistWithUsername) throw alreadyMemberRegisteringUserNotification
                if(!this.bangarangAdapters.passwordInteractor.isPasswordSecure(password)) throw unsecurePasswordRegisteringUserNotification
                if(!this.bangarangAdapters.emailInteractor.isEmailValid(userContract.email)) throw badEmailRegisteringUserNotification
                return this.bangarangAdapters.bangarangMembersInteractor.saveMember(userContract)
            })
            .then(result=>{
                if (result instanceof Error ) throw result
                return this.bangarangAdapters.bangarangMembersInteractor.saveCredentials({username:userContract.username,password:password})
            })
            .then(result =>{
                if (result instanceof Error ) throw result
                this.bangarangAdapters.registeringUserNotificationInteractor.notify(successRegisteringUserNotification)
            })
            .catch((result:RegisteringUserNotificationContract|Error) => {
                if(result instanceof Error) console.warn (`Unhandled error : ${result}`)
                else this.bangarangAdapters.registeringUserNotificationInteractor.notify(result)
            })
        }   
    }
    readonly name: CommandName = "Registering"
}