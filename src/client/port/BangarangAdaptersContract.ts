import type { BangarangUserInterfaceInteractor } from "./interactors/BangarangUserInterfaceInteractor";
import type { BangarangClaimInteractor } from "./interactors/BangarangClaimInteractor";
import type { BangarangMembersInteractorContract } from "./interactors/BangarangMembersInteractorContract";
import type { DeclaringClaimUserNotificationInteractorContract } from "./interactors/DeclaringClaimUserNotificationInteractorContract";
import type { RetrievingClaimUserNotificationInteractorContract } from "./interactors/RetrievingClaimUserNotificationInteractorContract";
import type { SigningInUserNotificationInteractorContract } from "./interactors/SigningInUserNotificationInteractorContract";
import type { SearchingClaimsUserNotificationInteractorContract } from "./interactors/SearchingClaimsUserNotificationInteractorContract";
import type { ClaimingUserNotificationInteractorContract } from "./interactors/ClaimingUserNotificationInteractorContract";
export interface BangarangAdaptersContract {
    bangarangClaimInteractor:BangarangClaimInteractor
    bangarangMembersInteractor: BangarangMembersInteractorContract;
    bangarangUserInterfaceInteractor:BangarangUserInterfaceInteractor;
    declaringClaimUserNotificationInteractor: DeclaringClaimUserNotificationInteractorContract;
    signingInUserNotificationInteractor: SigningInUserNotificationInteractorContract;
    retrievingClaimUserNotificationInteractor:RetrievingClaimUserNotificationInteractorContract;
    searchingClaimsUserNotificationInteractor:SearchingClaimsUserNotificationInteractorContract;
    claimingUserNotificationInteractor:ClaimingUserNotificationInteractorContract;
}
