import type { BangarangUserInterfaceInteractorContract } from "../port/interactors/BangarangUserInterfaceInteractor";
export class FakeBangarangUserInterfaceInteractor implements BangarangUserInterfaceInteractorContract {
    goToView(viewName: string): void {
        this.currentView=viewName
    }
    public currentView: string= ""
}
