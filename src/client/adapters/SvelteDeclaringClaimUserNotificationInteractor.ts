import { DeclaringClaimUserNotificationInteractorContract, DeclaringClaimUserNotificationContract, idleDeclaringClaimUserNotification } from "../port/interactors/DeclaringClaimUserNotificationInteractorContract";
import { declaringClaimUserNotificationStore } from "../stores/declaringClaimStore";
export class SvelteDeclaringClaimUserNotificationInteractor implements DeclaringClaimUserNotificationInteractorContract {
    notify(userNotification: DeclaringClaimUserNotificationContract): void {
        const timeOfClaimDeclaredNotification = 1500
        declaringClaimUserNotificationStore.set(userNotification)
        setTimeout(()=>declaringClaimUserNotificationStore.set(idleDeclaringClaimUserNotification),timeOfClaimDeclaredNotification)
    }
}