import type { UserNotificationContract } from "../UserNotification";
export interface UserNotificationInteractorContract {
    notify(userNotification: UserNotificationContract): void;
}
