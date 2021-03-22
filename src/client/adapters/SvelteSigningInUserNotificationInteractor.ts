import { idleSigningInNotification, SigningInUserNotificationContract, SigningInUserNotificationInteractorContract } from '../port/interactors/SigningInUserNotificationInteractorContract';
import { signingInNotificationStore } from '../stores/signInStore';
export class SvelteSigningInUserNotificationInteractor implements SigningInUserNotificationInteractorContract {
    notify(userNotification: SigningInUserNotificationContract): void {
        const timeOfSignedNotification = 1500
        signingInNotificationStore.set(userNotification)
        setTimeout(()=>signingInNotificationStore.set(idleSigningInNotification),timeOfSignedNotification)
    }
}
