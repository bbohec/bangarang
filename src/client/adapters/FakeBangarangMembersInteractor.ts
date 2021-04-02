import { bangarangMemberNotFoundError, BangarangMembersInteractorContract } from "../port/interactors/BangarangMembersInteractorContract";
import type { MemberClaim } from "../port/MemberClaim";
import type { UserContract } from "../port/UserContact";
import { Credentials, credentialsMissing } from "../port/bangarangMemberCredential";
import type { ClaimChoice } from "../port/ClaimChoice";
import { retrievingClaimUserNotificationStore } from "../stores/retrievingClaimStore";
export class FakeBangarangMembersInteractor implements BangarangMembersInteractorContract {
    public isMemberExistWithUsername(username: string): Promise<boolean> {
        const result = this.members.some(member => member.username === username)
        return Promise.resolve(result)
    }
    public isSignedIn(username: string): Promise<boolean|Error> {
        const result = this.signedInMembers.some(signedInUsername => signedInUsername===username)
        return Promise.resolve(result)
    }
    public retrievePreviousMemberClaimChoiceOnClaim(username:string,claimTitle:string): Promise<ClaimChoice|Error> {
        if(username === "error") return Promise.resolve( new Error(`Error, user with username ${username} not supported.`))
        const result =  this.membersClaims
            .find(memberClaim => memberClaim.memberUsername === username && memberClaim.claimTitle === claimTitle)
            ?.claimChoice
        return Promise.resolve(result)
    }
    public saveCredentials(credentials: Credentials): Promise<void|Error> {
        if(credentials.username === "error") return Promise.resolve(new Error(`Error, user with username ${credentials.username} not supported.`))
        return this.saveOnDatabasePattern(credentials,this.membersCredentials,credentialOnDatabase=>credentialOnDatabase.username===credentials.username);
    }
    public saveMember(userContract: UserContract): Promise<void|Error> {
        if(userContract.username === "error")  return Promise.resolve(new Error(`Error, user with username ${userContract.username} not supported.`))
        return this.saveOnDatabasePattern(userContract,this.members,bangarangMember => bangarangMember.username === userContract.username)
    }
    public saveMemberClaim(memberClaim: MemberClaim): Promise<void|Error> {
        return this.saveOnDatabasePattern(memberClaim,this.membersClaims,bangarangMemberClaim => bangarangMemberClaim.claimTitle === memberClaim.claimTitle)
    }
    public signingIn(credentials: Credentials):Promise<void|Error> {
        const resolvePromise=(error?:Error)=>(error)?Promise.resolve(error):Promise.resolve()
        try {
            if (this.specificFindMemberPasswordFromUsername(credentials.username) === credentials.password) {
                this.signedInMembers.push(this.specificFindMemberFromUsername(credentials.username).username)
                return resolvePromise()
            } else return resolvePromise(new Error(`Bad credentials for user '${credentials.username}'`))
        } catch (error) {return resolvePromise(error)}
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
    public reset():Promise<void> {
        this.specificWithCredentials([])
        this.specificWithMembers([])
        this.specificWithMembersClaims([])
        this.specificWithSignedInMembers([])
        return Promise.resolve()
    }
    private saveOnDatabasePattern<Type>(toSave: Type,database:Type[],finder:(databaseElement: Type) => boolean):Promise<void> {
        const databaseElementIndex = database.findIndex(finder);
        (databaseElementIndex > -1)?database[databaseElementIndex] = toSave:database.push(toSave);
        return Promise.resolve()
    }
    private membersCredentials:Credentials[] = []
    private members: UserContract[]= []
    private membersClaims:MemberClaim[]=[]
    private signedInMembers:string[] = []
}
