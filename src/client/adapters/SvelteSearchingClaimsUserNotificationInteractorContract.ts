import { idleSearchingClaimsUserNotification, SearchingClaimsUserNotificationContract, SearchingClaimsUserNotificationInteractorContract } from '../port/interactors/SearchingClaimsUserNotificationInteractorContract';
import { searchingClaimsUserNotificationStore } from '../stores/searchingClaimsStore';
export class SvelteSearchingClaimsUserNotificationInteractor implements SearchingClaimsUserNotificationInteractorContract {
    notify(userNotification: SearchingClaimsUserNotificationContract): void {
        const timeOfSearchingClaimsNotification = 1500
        searchingClaimsUserNotificationStore.set(userNotification)
        setTimeout(()=>searchingClaimsUserNotificationStore.set(idleSearchingClaimsUserNotification),timeOfSearchingClaimsNotification)
    }

}
