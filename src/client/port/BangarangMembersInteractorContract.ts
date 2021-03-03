import type { UserContact } from "./UserContact";
export interface BangarangMembersInteractorContract {
    isGuest(username: string): boolean;
    findBangarangMemberFromUsername(username: string): UserContact;
}