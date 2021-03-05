import type { BangarangMembersInteractorContract } from "../port/interactors/BangarangMembersInteractorContract";
import type { UserContact } from "../port/UserContact";
export class FakeBangarangMembersInteractor implements BangarangMembersInteractorContract {
    constructor(
        private bangarangMembersDatabase: UserContact[]= [],
        private bangarangSignedInMemberDatabase:UserContact[] = []
    ) {}
    signingIn(username: string, password: string):void|Error {
        try {
            const bangarangMember = this.findBangarangMemberFromUsername(username)
            if (bangarangMember.password === password) this.bangarangSignedInMemberDatabase.push(bangarangMember)
            else {throw new Error(`Bad credentials for user '${bangarangMember}'`)}
        } catch (error) {return error}
        
    }
    isSignedIn(username: string): Boolean {
        return (this.bangarangSignedInMemberDatabase
            .find(member => member === this.findBangarangMemberFromUsername(username)) !== undefined)
    }
    findBangarangMemberFromUsername(username: string): UserContact {
        const bangarangMember = this.bangarangMembersDatabase.find(member => member.username === username);
        if (bangarangMember) return bangarangMember;
        throw new Error(bangarangMemberNotFoundError(username));
    } 
}
export const bangarangMemberNotFoundError = (username: string):string => `Bangarang member with username '${username}' not found`;

