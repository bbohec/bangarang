import type { BangarangUserInterfaceInteractorContract } from "../port/interactors/BangarangUserInterfaceInteractor";
import { goto } from '@sapper/app';
export class SvelteBangarangUserInterfaceInteractor implements BangarangUserInterfaceInteractorContract {
    goToView(viewName: string): void {
        goto(viewName)
    }

}
