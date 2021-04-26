import type { UserNotificationContract } from '../UserNotification';
import type { UserNotificationInteractorContract } from './UserNotificationInteractorContract';
export interface RegisteringUserNotificationInteractorContract extends UserNotificationInteractorContract {
    notify(userNotification: RegisteringUserNotificationContract): void;
}
export interface RegisteringUserNotificationContract extends UserNotificationContract {
    type:RegisteringNotificationType
}
export type RegisteringNotificationType="Registering."
export const successRegisteringUserNotification:RegisteringUserNotificationContract = {status:"Success", message:{en:"Registered.",fr:`Enregistré.`},type:"Registering."}
export const badEmailRegisteringUserNotification:RegisteringUserNotificationContract = {status:"Failed", message:{en:"Email invalid.",fr:`Email invalide.`},type:"Registering."}
export const unsecurePasswordRegisteringUserNotification:RegisteringUserNotificationContract = {status:"Failed", message:{en:"Unsecure password.",fr:`Mot de passe pas sécurisé.`},type:"Registering."}
export const alreadyMemberRegisteringUserNotification:RegisteringUserNotificationContract = {status:"Failed", message:{en:"Already member of Bangarang.",fr:`Déjà membre de Bangarang.`},type:"Registering."}
export const idleMemberRegisteringUserNotification:RegisteringUserNotificationContract = {status:"Idle", message:{en:"Waiting for Registering Event.",fr:`En attente d'événement d'enregistrement.`},type:"Registering."}
export const executingMemberRegisteringUserNotification:RegisteringUserNotificationContract = {status:"Executing", message:{en:"Registering...",fr:`Enregistrement en cours...`},type:"Registering."}