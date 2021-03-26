import { BangarangUserInterfaceInteractorContract, StaticView } from "../port/interactors/BangarangUserInterfaceInteractor";
import { goto } from '@sapper/app';
import { linkPrefixes } from "../navigation/linkPrefixes";
export class SvelteBangarangUserInterfaceInteractor implements BangarangUserInterfaceInteractorContract {
    goToSigningInMenu() {
        goto(StaticView.SigningInMenu)
    }
    goToClaim(claimId: string): void {
        goto(linkPrefixes.claimLinkPrefix+claimId)
    }

}
