import type { SigningInUserNotificationContract, SigningInUserNotificationInteractorContract } from '../port/interactors/SigningInUserNotificationInteractorContract';
export class FakeSigningInUserNotificationInteractor implements SigningInUserNotificationInteractorContract {
    constructor() {}
    notify(userNotification: SigningInUserNotificationContract): void {
        this.currentUserNotification=userNotification
    }
    public currentUserNotification:SigningInUserNotificationContract|undefined
}
