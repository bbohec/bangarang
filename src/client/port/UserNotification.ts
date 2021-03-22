export interface UserNotificationContract {
    status: UserNotificationStatus;
    message: string;
    type:string;
}
export type UserNotificationStatus = "Success"|"Failed"|"Idle"|"Executing"