import type { BangarangClaimInteractor } from "./interactors/BangarangClaimInteractor";
import type { BangarangMembersInteractorContract } from "./interactors/BangarangMembersInteractorContract";
import type { DeclaringClaimUserNotificationInteractorContract } from "./interactors/DeclaringClaimUserNotificationInteractorContract";
import type { SigningInUserNotificationInteractorContract } from "./interactors/SigningInUserNotificationInteractorContract";
export interface BangarangAdaptersContract {
    bangarangClaimInteractor:BangarangClaimInteractor
    bangarangMembersInteractor: BangarangMembersInteractorContract;
    declaringClaimUserNotificationInteractor: DeclaringClaimUserNotificationInteractorContract;
    signingInUserNotificationInteractor: SigningInUserNotificationInteractorContract;
}