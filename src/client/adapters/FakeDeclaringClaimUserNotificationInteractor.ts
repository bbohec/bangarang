import type { DeclaringClaimUserNotificationInteractorContract, DeclaringClaimUserNotificationContract } from "../port/interactors/DeclaringClaimUserNotificationInteractorContract";
export class FakeDeclaringClaimUserNotificationInteractor implements DeclaringClaimUserNotificationInteractorContract {
    resetNotification():void {
        this.currentUserNotification = undefined
    }
    public notify(userNotification: DeclaringClaimUserNotificationContract): void {
        this.currentUserNotification = userNotification;
    }
    public currentUserNotification: DeclaringClaimUserNotificationContract | undefined;
}