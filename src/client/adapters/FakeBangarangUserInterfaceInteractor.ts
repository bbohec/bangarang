import { BangarangUserInterfaceInteractorContract, StaticView } from "../port/interactors/BangarangUserInterfaceInteractor";
import type { UserContract } from "../port/UserContact";
export class FakeBangarangUserInterfaceInteractor implements BangarangUserInterfaceInteractorContract {
    applySignedInUserContract(userContract: UserContract | undefined): void {
        this.signedInUserContract=userContract
    }
    retrieveSignedInUserContract(): UserContract | undefined {
        return this.signedInUserContract
    }
    goToSigningInMenu() {
        this.currentView=StaticView.SigningInMenu
    }
    goToClaim(claimId: string): void {
        this.currentView=claimId
    }
    resetSignedInUserContract():void {
        this.signedInUserContract = undefined
    }
    private signedInUserContract:UserContract|undefined = undefined;
    public currentView: string= ""
}
