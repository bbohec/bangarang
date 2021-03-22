import type { BangarangUserInterfaceInteractorContract } from "./interactors/BangarangUserInterfaceInteractor";
import type { BangarangClaimInteractorContract } from "./interactors/BangarangClaimInteractorContract";
import type { BangarangMembersInteractorContract } from "./interactors/BangarangMembersInteractorContract";
import type { DeclaringClaimUserNotificationInteractorContract } from "./interactors/DeclaringClaimUserNotificationInteractorContract";
import type { RetrievingClaimUserNotificationInteractorContract } from "./interactors/RetrievingClaimUserNotificationInteractorContract";
import type { SigningInUserNotificationInteractorContract } from "./interactors/SigningInUserNotificationInteractorContract";
import type { SearchingClaimsUserNotificationInteractorContract } from "./interactors/SearchingClaimsUserNotificationInteractorContract";
import type { ClaimingUserNotificationInteractorContract } from "./interactors/ClaimingUserNotificationInteractorContract";
import type { RegisteringUserNotificationInteractorContract } from "./interactors/RegisteringUserNotificationInteractorContract";
import type { EmaimInteractorContract } from "./interactors/EmailInteractorContract";
import type { PasswordInteractorContract } from "./interactors/PasswordInteractorContract";
export interface BangarangAdaptersContract {
    passwordInteractor: PasswordInteractorContract;
    emailInteractor: EmaimInteractorContract;
    bangarangClaimInteractor:BangarangClaimInteractorContract
    bangarangMembersInteractor: BangarangMembersInteractorContract;
    bangarangUserInterfaceInteractor:BangarangUserInterfaceInteractorContract;
    declaringClaimUserNotificationInteractor: DeclaringClaimUserNotificationInteractorContract;
    signingInUserNotificationInteractor: SigningInUserNotificationInteractorContract;
    retrievingClaimUserNotificationInteractor:RetrievingClaimUserNotificationInteractorContract;
    searchingClaimsUserNotificationInteractor:SearchingClaimsUserNotificationInteractorContract;
    claimingUserNotificationInteractor:ClaimingUserNotificationInteractorContract;
    registeringUserNotificationInteractor:RegisteringUserNotificationInteractorContract
}
