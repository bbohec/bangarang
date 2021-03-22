import type { RegisteringUserNotificationContract, RegisteringUserNotificationInteractorContract } from '../port/interactors/RegisteringUserNotificationInteractorContract';
export class FakeRegisteringUserNotificationInteractor implements RegisteringUserNotificationInteractorContract {
    constructor() {}
    notify(userNotification: RegisteringUserNotificationContract): void {
        this.currentUserNotification=userNotification
    }
    public currentUserNotification:RegisteringUserNotificationContract|undefined
}
