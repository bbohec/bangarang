import type { UserContract } from '../port/UserContact';
import type { BangarangAdaptersContract } from '../port/BangarangAdaptersContract';
import type { BangarangMembersInteractorContract } from '../port/interactors/BangarangMembersInteractorContract';
import type { RegisteringUserNotificationInteractorContract } from '../port/interactors/RegisteringUserNotificationInteractorContract';
import { User } from './User';
import { FakeBangarangClaimInteractor } from '../adapters/FakeBangarangClaimInteractor';
import { FakeBangarangMembersInteractor } from '../adapters/FakeBangarangMembersInteractor';
import { FakeBangarangUserInterfaceInteractor } from '../adapters/FakeBangarangUserInterfaceInteractor';
import { FakeDeclaringClaimUserNotificationInteractor } from '../adapters/FakeDeclaringClaimUserNotificationInteractor';
import { FakeSigningInUserNotificationInteractor } from '../adapters/FakeSigningInUserNotificationInteractor';
import { FakeSearchingClaimsUserNotificationInteractor } from '../adapters/FakeSearchingClaimsUserNotificationInteractor';
import { FakeRetrievingClaimUserNotificationInteractor } from '../adapters/FakeRetrievingClaimUserNotificationInteractor';
import { FakeClaimingUserNotificationInteractor } from '../adapters/FakeClaimingUserNotificationInteractor';
import { FakeRegisteringUserNotificationInteractor } from '../adapters/FakeRegisteringUserNotificationInteractor';
import type { BangarangClaimInteractorContract } from '../port/interactors/BangarangClaimInteractorContract';
import type { SearchingClaimsUserNotificationInteractorContract } from '../port/interactors/SearchingClaimsUserNotificationInteractorContract';
import { InternalEmailInteractor } from '../port/interactors/InternalEmailInteractor';
import type { ClaimingUserNotificationInteractorContract } from '../port/interactors/ClaimingUserNotificationInteractorContract';
import type { BangarangUserInterfaceInteractorContract } from '../port/interactors/BangarangUserInterfaceInteractor';
import type { SigningInUserNotificationInteractorContract } from '../port/interactors/SigningInUserNotificationInteractorContract';
import type { RetrievingClaimUserNotificationInteractorContract } from '../port/interactors/RetrievingClaimUserNotificationInteractorContract';
import type { DeclaringClaimUserNotificationInteractorContract } from '../port/interactors/DeclaringClaimUserNotificationInteractorContract';
import { FakePasswordInteractor } from '../adapters/FakePasswordInteractor';
export class UserBuilder {
    withDeclaringClaimUserNotificationInteractor(declaringClaimUserNotificationInteractor: DeclaringClaimUserNotificationInteractorContract):UserBuilder  {
        this.bangarangAdapters.declaringClaimUserNotificationInteractor=declaringClaimUserNotificationInteractor
        return this
    }
    withRetrievingClaimUserNotificationInteractor(retrievingClaimUserNotificationInteractor: RetrievingClaimUserNotificationInteractorContract):UserBuilder  {
        this.bangarangAdapters.retrievingClaimUserNotificationInteractor = retrievingClaimUserNotificationInteractor
        return this
    }
    withSigningInUserNotificationInteractor(signingInUserNotificationInteractor: SigningInUserNotificationInteractorContract):UserBuilder {
        this.bangarangAdapters.signingInUserNotificationInteractor = signingInUserNotificationInteractor
        return this
    }
    withClaimingUserNotificationInteractor(claimingUserNotificationInteractor: ClaimingUserNotificationInteractorContract):UserBuilder {
        this.bangarangAdapters.claimingUserNotificationInteractor = claimingUserNotificationInteractor
        return this
    }
    withBangarangUserInterfaceInteractor(bangarangUserInterfaceInteractor: BangarangUserInterfaceInteractorContract):UserBuilder {
        this.bangarangAdapters.bangarangUserInterfaceInteractor = bangarangUserInterfaceInteractor
        return this
    }
    withSearchingClaimsUserNotificationInteractor(searchingClaimsUserNotificationInteractor: SearchingClaimsUserNotificationInteractorContract):UserBuilder {
        this.bangarangAdapters.searchingClaimsUserNotificationInteractor = searchingClaimsUserNotificationInteractor
        return this
    }
    withBangarangClaimInteractor(bangarangClaimInteractor: BangarangClaimInteractorContract):UserBuilder {
        this.bangarangAdapters.bangarangClaimInteractor = bangarangClaimInteractor
        return this
    }
    getUser(): User {
        if (!this.user) this.user =  new User(this.userContract, this.bangarangAdapters);
        return this.user
    }
    resetUser(): User {
        this.user =  new User(this.userContract, this.bangarangAdapters);
        return this.user
    }
    withUserContract(userContract: UserContract): UserBuilder {
        this.userContract = userContract;
        return this;
    }
    withBangarangMembersInteractor(bangarangMembersInteractor: BangarangMembersInteractorContract): UserBuilder {
        this.bangarangAdapters.bangarangMembersInteractor = bangarangMembersInteractor;
        return this;
    }
    withRegisteringUserNotificationInteractor(registeringUserNotificationInteractor: RegisteringUserNotificationInteractorContract): UserBuilder {
        this.bangarangAdapters.registeringUserNotificationInteractor = registeringUserNotificationInteractor;
        return this;
    }
    private userContract: UserContract = { username: "", fullname: "", email: "" };
    private bangarangAdapters: BangarangAdaptersContract = {
        bangarangClaimInteractor: new FakeBangarangClaimInteractor(),
        bangarangMembersInteractor: new FakeBangarangMembersInteractor(),
        bangarangUserInterfaceInteractor: new FakeBangarangUserInterfaceInteractor(),
        declaringClaimUserNotificationInteractor: new FakeDeclaringClaimUserNotificationInteractor(),
        signingInUserNotificationInteractor: new FakeSigningInUserNotificationInteractor(),
        retrievingClaimUserNotificationInteractor: new FakeRetrievingClaimUserNotificationInteractor(),
        searchingClaimsUserNotificationInteractor: new FakeSearchingClaimsUserNotificationInteractor(),
        claimingUserNotificationInteractor: new FakeClaimingUserNotificationInteractor(),
        registeringUserNotificationInteractor: new FakeRegisteringUserNotificationInteractor(),
        emailInteractor:new InternalEmailInteractor(),
        passwordInteractor:new FakePasswordInteractor()
    };
    private user:User|undefined;
}
