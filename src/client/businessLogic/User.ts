import type { BangarangAdaptersContract } from "../port/BangarangAdaptersContract";
import type { UserContact } from "../port/UserContact";
export class User implements UserContact {
    constructor(userContract: UserContact, bangarangAdapters: BangarangAdaptersContract) {
        this.username = userContract.username;
        this.fullname = userContract.fullname;
        this.password = userContract.password;
        this.bangarangAdapters = bangarangAdapters;
    }
    username: string;
    fullname: string;
    password: string;
    isGuest(): boolean {
        return this.bangarangAdapters.bangarangMembersInteractor.isGuest(this.username);
    }
    signingIn(username: string, password: string) {
        const bangarangMember = this.bangarangAdapters.bangarangMembersInteractor.findBangarangMemberFromUsername(username);
        this.username = bangarangMember.username;
        this.fullname = bangarangMember.fullname;
    }
    private bangarangAdapters: BangarangAdaptersContract;
}
