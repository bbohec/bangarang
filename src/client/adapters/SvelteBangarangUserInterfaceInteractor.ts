import { BangarangUserInterfaceInteractorContract, StaticView } from "../port/interactors/BangarangUserInterfaceInteractor";
import { goto } from '@sapper/app';
import { linkPrefixes } from "../navigation/linkPrefixes";
import { languageStore } from "../stores/languageStore";
export class SvelteBangarangUserInterfaceInteractor implements BangarangUserInterfaceInteractorContract {
    goToSigningInMenu() {
        let url = "/"
        const unsubscribeLanguageStore = languageStore.subscribe(language=> url=`/${language}/${StaticView.SigningInMenu}`)
        goto(url)
        unsubscribeLanguageStore()
    }
    goToClaim(claimId: string): void {
        let url = "/"
        const unsubscribeLanguageStore = languageStore.subscribe(language=> url=`/${language}/${linkPrefixes.claimLinkPrefix}${claimId}`)
        goto(url)
        unsubscribeLanguageStore()
    }
}