import { bangarangMemberNotFoundError, BangarangMembersInteractorContract } from "../port/interactors/BangarangMembersInteractorContract";
import type { MemberClaim } from "../port/MemberClaim";
import type { UserContract } from "../port/UserContact";
import { Credentials, credentialsMissing } from "../port/bangarangMemberCredential";
export class FakeBangarangMembersInteractor implements BangarangMembersInteractorContract {
    public isMemberExistWithUsername(username: string): boolean {
        return this.members.some(member => member.username === username)
    }
    public isSignedIn(username: string): boolean|Error {
        return this.signedInMembers.some(signedInUsername => signedInUsername===username)
    }
    public retrievePreviousMemberClaimChoiceOnClaim(username:string,claimTitle:string): "For"|"Against"|undefined {
        return this.membersClaims
            .find(memberClaim => memberClaim.memberUsername === username && memberClaim.claimTitle === claimTitle)
            ?.claimChoice
    }
    public saveCredentials(credentials: Credentials): void {
        this.saveOnDatabasePattern(credentials,this.membersCredentials,credentialOnDatabase=>credentialOnDatabase.username===credentials.username);
    }
    public saveMember(userContract: UserContract): void {
        this.saveOnDatabasePattern(userContract,this.members,bangarangMember => bangarangMember.username === userContract.username)
    }
    public saveMemberClaim(memberClaim: MemberClaim): void {
        this.saveOnDatabasePattern(memberClaim,this.membersClaims,bangarangMemberClaim => bangarangMemberClaim.claimTitle === memberClaim.claimTitle)
    }
    public signingIn(credentials: Credentials):void|Error {
        try {
            if (this.specificFindMemberPasswordFromUsername(credentials.username) === credentials.password) 
                this.signedInMembers.push(this.specificFindMemberFromUsername(credentials.username).username)
            else throw new Error(`Bad credentials for user '${credentials.username}'`)
        } catch (error) {return error}
        
    }
    public specificFindMemberFromUsername(username: string): UserContract {
        const bangarangMember = this.members.find(member => member.username === username);
        if (bangarangMember) return bangarangMember;
        throw new Error(bangarangMemberNotFoundError(username));
    }
    public specificFindMemberPasswordFromUsername(username: string):string {
        const credentials = this.membersCredentials.find(credentials => credentials.username === username)
        if (credentials) return credentials.password
        throw new Error (credentialsMissing(username))
    }
    
    public specificWithMembersClaims(membersClaims:MemberClaim[]):void{
        this.membersClaims=membersClaims
    }
    public specificWithMembers(members:UserContract[]):void {
        this.members=members
    }
    public specificWithSignedInMembers(signedInMembers:string[]):void{
        this.signedInMembers=signedInMembers
    }
    public specificWithCredentials(credentials:Credentials[]):void {
        this.membersCredentials = credentials
    }
    private saveOnDatabasePattern<Type>(toSave: Type,database:Type[],finder:(databaseElement: Type) => boolean):void {
        const databaseElementIndex = database.findIndex(finder);
        (databaseElementIndex > -1)?database[databaseElementIndex] = toSave:database.push(toSave);
    }
    private membersCredentials:Credentials[] = []
    private members: UserContract[]= []
    private membersClaims:MemberClaim[]=[]
    private signedInMembers:string[] = []
}
