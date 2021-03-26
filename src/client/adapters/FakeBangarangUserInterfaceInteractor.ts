import { BangarangUserInterfaceInteractorContract, StaticView } from "../port/interactors/BangarangUserInterfaceInteractor";
export class FakeBangarangUserInterfaceInteractor implements BangarangUserInterfaceInteractorContract {
    goToSigningInMenu() {
        this.currentView=StaticView.SigningInMenu
    }
    goToClaim(claimId: string): void {
        this.currentView=claimId
    }
    public currentView: string= ""
}
