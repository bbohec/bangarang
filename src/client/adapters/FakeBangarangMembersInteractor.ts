import { bangarangMemberNotFoundError, BangarangMembersInteractorContract } from "../port/interactors/BangarangMembersInteractorContract";
import type { MemberClaim } from "../port/MemberClaim";
import type { UserContract } from "../port/UserContact";
import { Credentials, credentialsMissing } from "../port/bangarangMemberCredential";
import type { ClaimChoice } from "../port/ClaimChoice";
export class FakeBangarangMembersInteractor implements BangarangMembersInteractorContract {
    public retrieveUserContract(username: string): Promise<UserContract | undefined | Error> {
        if(username === "error") return Promise.resolve(new Error(`${username} error!`))
        const userContract = this.members.find(user => user.username === username)
        return Promise.resolve(userContract)
    }
    public isMemberExistWithUsername(username: string): Promise<boolean> {
        const result = this.members.some(member => member.username === username)
        return Promise.resolve(result)
    }
    public retrievePreviousMemberClaimChoiceOnClaim(username:string,claimId:string): Promise<ClaimChoice|Error> {
        if(username === "error") return Promise.resolve( new Error(`Error, user with username ${username} not supported.`))
        const result =  this.membersClaims
            .find(memberClaim => memberClaim.memberUsername === username && memberClaim.claimId === claimId)
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
        return this.saveOnDatabasePattern(memberClaim,this.membersClaims,bangarangMemberClaim => bangarangMemberClaim.claimId === memberClaim.claimId)
    }
    public isCredentialsValid(credentials: Credentials):Promise<boolean|Error> {
        const validCredentials = this.membersCredentials.find(credentialOnDatabase => credentialOnDatabase.username === credentials.username && credentialOnDatabase.password === credentials.password)
        if (validCredentials === undefined) return Promise.resolve(false)
        return Promise.resolve(true)
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
    public specificWithCredentials(credentials:Credentials[]):void {
        this.membersCredentials = credentials
    }
    public reset():Promise<void> {
        this.specificWithCredentials([])
        this.specificWithMembers([])
        this.specificWithMembersClaims([])
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
}
