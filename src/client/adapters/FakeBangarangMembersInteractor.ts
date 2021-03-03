import type { BangarangMembersInteractorContract } from "../port/BangarangMembersInteractorContract";
import type { UserContact } from "../port/UserContact";
export class FakeBangarangMembersInteractor implements BangarangMembersInteractorContract {
    constructor(bangarangMembersDatabase: UserContact[]) {
        this.bangarangMembersDatabase = bangarangMembersDatabase;
    }
    isGuest(username: string): boolean {
        return !this.bangarangMembersDatabase.some(member => member.username === username);
    }
    findBangarangMemberFromUsername(username: string): UserContact {
        const bangarangMember = this.bangarangMembersDatabase.find(member => member.username === username);
        if (bangarangMember) return bangarangMember;
        throw `Bangarang member with username '${username}' not found`;
    }
    private bangarangMembersDatabase: UserContact[];
}