import type { MemberClaim } from "../port/MemberClaim";
import type { UserContract } from "../port/UserContact";
import type { ClaimChoice } from "../port/ClaimChoice";
import type { BangarangMembersInteractorContract } from "../port/interactors/BangarangMembersInteractorContract";
import type { Credentials } from "../port/bangarangMemberCredential";
import type { GcpDatastoreInteractor } from "./GcpDatastoreInteractor";
export class GcpDatastoreBangarangMembersInteractor implements BangarangMembersInteractorContract {
    constructor( private gcpDatastoreInteractor:GcpDatastoreInteractor) {}
	reset():Promise<void> {
        const googleDatastoreKeys = [
            "MembersClaims/testclaimId",
            "Credentials/test",
            "Users/test",
            "SignedIn_Users/test",
        ]
        return Promise.all(googleDatastoreKeys.map(googleDatastoreKey=> this.gcpDatastoreInteractor.deleteRecordOnGoogleDatastore(googleDatastoreKey.split("/"))))
            .then(results => {
                const errors:Error[] = []
                results.forEach(result=> {if (result instanceof Error) errors.push(result)})
                if (errors.length > 0) throw new Error(`Errors on reset : ${errors.map(error=>error.message)}`)
            })
	}
    isMemberExistWithUsername(username: string): Promise<boolean | Error> {
        return this.gcpDatastoreInteractor.retreiveRecordOnGoogleDatastore<UserContract>(keyPathFromKindAndIdentifier("Users",username))
            .then(result => {
                if (!result) return false
                else if (result instanceof Error) return result
                return true
            })
    }
    isSignedIn(username: string): Promise<boolean | Error> {
        return this.gcpDatastoreInteractor.retreiveRecordOnGoogleDatastore<{username:string}>(keyPathFromKindAndIdentifier("SignedIn_Users",username))
            .then(result => {
                if (!result) return false
                else if (result instanceof Error) return result
                return true
            })
    }
    retrievePreviousMemberClaimChoiceOnClaim(username: string, claimId: string): Promise<ClaimChoice | Error> {
        return this.gcpDatastoreInteractor.retreiveRecordOnGoogleDatastore<MemberClaim>(keyPathFromKindAndIdentifier("MembersClaims",username+claimId))
            .then(result => {
                if (!result || result instanceof Error){
                    if (username === "error" && !result) return new Error(`User ${username} Error`)
                    return result
                }
                return result.claimChoice
            })
    }
    saveCredentials(credentials: Credentials): Promise<void | Error> {
        if(credentials.username === "error") return Promise.resolve(new Error ("Error with error user"))
        return this.gcpDatastoreInteractor.saveRecordOnGoogleDatastore(keyPathFromKindAndIdentifier("Credentials",credentials.username),credentials)
    }
    saveMember(userContract: UserContract): Promise<void | Error> {
        if(userContract.username === "error") return Promise.resolve(new Error ("Error with error user"))
        return this.gcpDatastoreInteractor.saveRecordOnGoogleDatastore(keyPathFromKindAndIdentifier("Users",userContract.username),userContract)
    }
    saveMemberClaim(memberClaim: MemberClaim): Promise<void | Error> {
        if(memberClaim.memberUsername === "error") return Promise.resolve(new Error ("Error with error user"))
        return this.gcpDatastoreInteractor.saveRecordOnGoogleDatastore(keyPathFromKindAndIdentifier("MembersClaims",memberClaim.memberUsername+memberClaim.claimId),memberClaim)
    }
    signingIn(credentials: Credentials): Promise<void | Error> {
        return this.retreiveUserPasswordFromUsername(credentials.username)
            .then(userPassword => {
                if (userPassword instanceof Error) return userPassword
                if (userPassword === credentials.password) return this.gcpDatastoreInteractor.saveRecordOnGoogleDatastore(keyPathFromKindAndIdentifier("SignedIn_Users",credentials.username),{username:credentials.username})
                return new Error("Bad credentials.")
            })
    }
    private retreiveUserPasswordFromUsername(username:string):Promise<string|Error>{
        return this.gcpDatastoreInteractor.retreiveRecordOnGoogleDatastore<Credentials>(keyPathFromKindAndIdentifier("Credentials",username))
            .then(result=>{
                if (!result) return new Error(`Credential ${username} of missing on Credentials kind.`)
                else if (result instanceof Error) return result
                return result.password
            })
    }
}
const keyPathFromKindAndIdentifier= (kind:Kind,identifier:string) => `${kind}/${identifier}`.split("/")
type Kind = "Credentials"|"Users"|"MembersClaims"|"SignedIn_Users"
