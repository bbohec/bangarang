import { BangarangUserInterfaceInteractorContract, StaticView } from "../port/interactors/BangarangUserInterfaceInteractor";
import { goto } from '@sapper/app';
import { linkPrefixes } from "../navigation/linkPrefixes";
import { languageStore } from "../stores/languageStore";
import type { UserContract } from "../port/UserContact";
export class SvelteBangarangUserInterfaceInteractor implements BangarangUserInterfaceInteractorContract {
    applySignedInUserContract(userContract: UserContract | undefined): void {
        this.signedInUserContract = userContract
    }
    retrieveSignedInUserContract(): UserContract | undefined {
        return this.signedInUserContract
    }
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
    private signedInUserContract: UserContract | undefined = undefined
}