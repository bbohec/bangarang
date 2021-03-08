import type { BangarangUserInterfaceInteractor } from "../port/interactors/BangarangUserInterfaceInteractor";
export class FakeBangarangUserInterfaceInteractor implements BangarangUserInterfaceInteractor {
    goToView(viewName: string): void {
        this.currentView=viewName
    }
    public currentView: string= ""
}
