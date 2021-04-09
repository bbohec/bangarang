import { uiBangarangUserBuilder } from "../adapters/uiPrimaryAdapter";
import { executingSearchingClaimsUserNotification } from "../port/interactors/SearchingClaimsUserNotificationInteractorContract";
import { searchingClaimsUserNotificationStore } from "../stores/searchingClaimsStore";
export const searchingClaims = (searchCriteria:string):void => {
    searchingClaimsUserNotificationStore.set(executingSearchingClaimsUserNotification)
    uiBangarangUserBuilder.getUser().searchingClaims(searchCriteria)
}