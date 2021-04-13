import { idleMemberRegisteringUserNotification, RegisteringUserNotificationContract, RegisteringUserNotificationInteractorContract } from '../port/interactors/RegisteringUserNotificationInteractorContract';
import { registeringUserNotificationStore } from '../stores/registeringStore';
export class SvelteRegisteringUserNotificationInteractor implements RegisteringUserNotificationInteractorContract {
    notify(userNotification: RegisteringUserNotificationContract): void {
        const timeOfClaimDeclaredNotification = 1500
        registeringUserNotificationStore.set(userNotification)
        setTimeout(()=>registeringUserNotificationStore.set(idleMemberRegisteringUserNotification),timeOfClaimDeclaredNotification)
    }
}