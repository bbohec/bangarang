import type { ClaimContract } from "../port/ClaimContract";
import type { BangarangAdaptersContract } from "../port/BangarangAdaptersContract";
import type { UserContact } from "../port/UserContact";
import { alreadySignedInSigningInNotification, badCredentialsSigningInNotification, successSigningInNotification } from "../port/interactors/SigningInUserNotificationInteractorContract";
import { claimAlreadyExistDeclaringClaimUserNotification, successDeclaringClaimUserNotification } from "../port/interactors/DeclaringClaimUserNotificationInteractorContract";
export class User implements UserContact  {
    constructor(userContract: UserContact, bangarangAdapters: BangarangAdaptersContract) {
        this.username = userContract.username;
        this.fullname = userContract.fullname;
        this.password = userContract.password;
        this.bangarangAdapters = bangarangAdapters;
    }
    public declareClaim(claim:ClaimContract):void {
        if (!this.bangarangAdapters.bangarangClaimInteractor.isClaimExist(claim)) {
            this.bangarangAdapters.bangarangClaimInteractor.declareClaim(claim)
            this.bangarangAdapters.declaringClaimUserNotificationInteractor.notify(successDeclaringClaimUserNotification)
        } else this.bangarangAdapters.declaringClaimUserNotificationInteractor.notify(claimAlreadyExistDeclaringClaimUserNotification(claim.title))
    }
    public signingIn():void {
        if(this.bangarangAdapters.bangarangMembersInteractor.isSignedIn(this.username))
            this.bangarangAdapters.signingInUserNotificationInteractor.notify(alreadySignedInSigningInNotification)
        else {
            const error = this.bangarangAdapters.bangarangMembersInteractor.signingIn(this.username,this.password)
            if (error) this.bangarangAdapters.signingInUserNotificationInteractor.notify(badCredentialsSigningInNotification)
            else this.bangarangAdapters.signingInUserNotificationInteractor.notify(successSigningInNotification)
        }
    }
    public isSignedIn():Boolean{
        return this.bangarangAdapters.bangarangMembersInteractor.isSignedIn(this.username)
    };
    public username: string;
    public fullname: string;
    public password: string;
    private bangarangAdapters: BangarangAdaptersContract;
}
