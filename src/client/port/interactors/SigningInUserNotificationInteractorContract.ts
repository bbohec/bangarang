import type { UserNotificationContract } from '../UserNotification';
import type { UserNotificationInteractorContract } from './UserNotificationInteractorContract';
export interface SigningInUserNotificationInteractorContract extends UserNotificationInteractorContract {
    notify(userNotification: SigningInUserNotificationContract): void;
}
export interface SigningInUserNotificationContract extends UserNotificationContract {
    type:SigningInNotificationType
}
export type SigningInNotificationType="Signing In"
export const idleSigningInNotification:SigningInUserNotificationContract = {status:"Idle", message:{en:"Waiting for SigningIn Event.",fr:`En attente d'un événément de connexion.`},type:"Signing In"}
export const executingSigningInNotification:SigningInUserNotificationContract = {status:"Executing", message:{en:"Signing In...",fr:`Connexion en cours...`},type:"Signing In"}
export const successSigningInNotification:SigningInUserNotificationContract = {status:"Success", message:{en:"Signed In.",fr:`Connecté.`},type:"Signing In"}
export const alreadySignedInSigningInNotification:SigningInUserNotificationContract = {status:"Failed", message:{en:"Already signed in.",fr:`Déjà connecté.`},type:"Signing In"}
export const badCredentialsSigningInNotification:SigningInUserNotificationContract = {status:"Failed", message:{en:"Bad credentials. Verify credentials or register to Bangarang.",fr:`Mauvais identifiants. Vérifier les identifiants ou s'enregistrer sur Bangarang.`},type:"Signing In"}