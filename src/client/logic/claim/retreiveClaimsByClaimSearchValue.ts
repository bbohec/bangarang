import { uiBangarangUserBuilder } from "../../adapters/uiPrimaryAdapter";
import { executingSearchingClaimsUserNotification } from "../../port/interactors/SearchingClaimsUserNotificationInteractorContract";
import { searchingClaimsUserNotificationStore } from "../../stores/searchingClaimsStore";
export const searchingClaims = (searchCriteria:string):void => {
    searchingClaimsUserNotificationStore.set(executingSearchingClaimsUserNotification)
    setTimeout(() => {
        console.log(`uiBangarangUserBuilder.getUser().searchingClaims(${searchCriteria})`)
        uiBangarangUserBuilder.getUser().searchingClaims(searchCriteria)
    }, searchingClaimsFakeWaitingTime);
}
const searchingClaimsFakeWaitingTime = 500;