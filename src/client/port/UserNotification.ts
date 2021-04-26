import type { MessageContract } from "../logic/language";

export interface UserNotificationContract {
    status: UserNotificationStatus;
    message: MessageContract;
    type:string;
}
export type UserNotificationStatus = "Success"|"Failed"|"Idle"|"Executing"