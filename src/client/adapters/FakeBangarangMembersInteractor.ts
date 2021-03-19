import { bangarangMemberNotFoundError, BangarangMembersInteractorContract } from "../port/interactors/BangarangMembersInteractorContract";
import type { MemberClaim } from "../port/MemberClaim";
import type { UserContract } from "../port/UserContact";
export class FakeBangarangMembersInteractor implements BangarangMembersInteractorContract {
    public saveMemberClaim(memberClaim: MemberClaim): void {
        const memberClaimIndex = this.bangarangMembersClaims.findIndex(bangarangMemberClaim => bangarangMemberClaim.claimTitle === memberClaim.claimTitle)
        if (memberClaimIndex > -1) this.bangarangMembersClaims[memberClaimIndex] = memberClaim
        else this.bangarangMembersClaims.push(memberClaim)
    }
    public memberHasClaimedOnClaim(username:string,claimTitle:string): "For"|"Against"|undefined {
        return this.bangarangMembersClaims
            .find(memberClaim => memberClaim.memberUsername === username && memberClaim.claimTitle === claimTitle)?.claimChoice
    }
    public signingIn(username: string, password: string):void|Error {
        try {
            const bangarangMember = this.findBangarangMemberFromUsername(username)
            if (bangarangMember.password === password) this.bangarangSignedInMemberDatabase.push(bangarangMember)
            else {throw new Error(`Bad credentials for user '${bangarangMember}'`)}
        } catch (error) {return error}
        
    }
    public isSignedIn(username: string): Boolean {
        return (this.bangarangSignedInMemberDatabase
            .find(member => member === this.findBangarangMemberFromUsername(username)) !== undefined)
    }
    public findBangarangMemberFromUsername(username: string): UserContract {
        const bangarangMember = this.bangarangMembersDatabase.find(member => member.username === username);
        if (bangarangMember) return bangarangMember;
        throw new Error(bangarangMemberNotFoundError(username));
    }
    withBangarangMembersDatabase(bangarangMembersDatabase:UserContract[]):void {
        this.bangarangMembersDatabase=bangarangMembersDatabase
    }
    withMembersClaims(membersClaims:MemberClaim[]):void{
        this.bangarangMembersClaims=membersClaims
    }
    withBangarangSignedInMemberDatabase(bangarangSignedInMemberDatabase:UserContract[]):void{
        this.bangarangSignedInMemberDatabase=bangarangSignedInMemberDatabase
    }
    private bangarangMembersDatabase: UserContract[]= []
    private bangarangMembersClaims:MemberClaim[]=[]
    private bangarangSignedInMemberDatabase:UserContract[] = []
}

