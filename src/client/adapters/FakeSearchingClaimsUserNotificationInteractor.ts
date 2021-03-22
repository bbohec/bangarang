import type { SearchingClaimsUserNotificationContract, SearchingClaimsUserNotificationInteractorContract } from '../port/interactors/SearchingClaimsUserNotificationInteractorContract';
export class FakeSearchingClaimsUserNotificationInteractor implements SearchingClaimsUserNotificationInteractorContract {
    notify(userNotification: SearchingClaimsUserNotificationContract): void {
        this.currentNotification = userNotification;
    }
    public currentNotification: SearchingClaimsUserNotificationContract | undefined;
}
