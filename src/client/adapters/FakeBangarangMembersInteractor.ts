import { bangarangMemberNotFoundError, BangarangMembersInteractorContract } from "../port/interactors/BangarangMembersInteractorContract";
import type { MemberClaim } from "../port/MemberClaim";
import type { UserContract } from "../port/UserContact";
export class FakeBangarangMembersInteractor implements BangarangMembersInteractorContract {
    public isMemberExistWithUsername(username: string): boolean {
        return this.bangarangMembers.some(member => member.username === username)
    }
    public save(userContract: UserContract): void {
        const bangarangMemberIndex = this.bangarangMembers.findIndex(bangarangMember => bangarangMember.username === userContract.username)
        if (bangarangMemberIndex > -1) this.bangarangMembers[bangarangMemberIndex] = userContract
        else this.bangarangMembers.push(userContract)
    }
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
            if (bangarangMember.password === password) this.bangarangSignedInMembersDatabase.push(bangarangMember)
            else {throw new Error(`Bad credentials for user '${bangarangMember}'`)}
        } catch (error) {return error}
        
    }
    public isSignedIn(username: string): Boolean {
        return (this.bangarangSignedInMembersDatabase
            .find(member => member === this.findBangarangMemberFromUsername(username)) !== undefined)
    }
    public findBangarangMemberFromUsername(username: string): UserContract {
        const bangarangMember = this.bangarangMembers.find(member => member.username === username);
        if (bangarangMember) return bangarangMember;
        throw new Error(bangarangMemberNotFoundError(username));
    }
    withBangarangMembersDatabase(bangarangMembersDatabase:UserContract[]):void {
        this.bangarangMembers=bangarangMembersDatabase
    }
    withMembersClaims(membersClaims:MemberClaim[]):void{
        this.bangarangMembersClaims=membersClaims
    }
    withBangarangSignedInMemberDatabase(bangarangSignedInMemberDatabase:UserContract[]):void{
        this.bangarangSignedInMembersDatabase=bangarangSignedInMemberDatabase
    }
    private bangarangMembers: UserContract[]= []
    private bangarangMembersClaims:MemberClaim[]=[]
    private bangarangSignedInMembersDatabase:UserContract[] = []
}

