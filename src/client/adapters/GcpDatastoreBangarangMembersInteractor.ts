import type { MemberClaim } from "../port/MemberClaim";
import type { UserContract } from "../port/UserContact";
import type { ClaimChoice } from "../port/ClaimChoice";
import type { BangarangMembersInteractorContract } from "../port/interactors/BangarangMembersInteractorContract";
import type { Credentials } from "../port/bangarangMemberCredential";
import type { GcpDatastoreInteractor } from "./GcpDatastoreInteractor";
export class GcpDatastoreBangarangMembersInteractor implements BangarangMembersInteractorContract {
    constructor( private gcpDatastoreInteractor:GcpDatastoreInteractor) {}
    retrieveUserContract(username: string): Promise<Error | UserContract | undefined> {
        if(username === "error") return Promise.resolve(new Error (`${username} error:!`))
        return this.gcpDatastoreInteractor.retreiveRecordOnGoogleDatastore<UserContract>(keyPathFromKindAndIdentifier("Users",username))
            .catch(error=>error)
    }
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
            .catch(error=>error)
	}
    isMemberExistWithUsername(username: string): Promise<boolean | Error> {
        return this.retrieveUserContract(username)
            .then(result => {
                if (result === undefined) return false
                else if (result instanceof Error) return result
                return true
            })
            .catch(error=>error)
    }
    isSignedIn(username: string): Promise<boolean | Error> {
        return this.gcpDatastoreInteractor.retreiveRecordOnGoogleDatastore<{username:string}>(keyPathFromKindAndIdentifier("SignedIn_Users",username))
            .then(result => {
                if (!result) return false
                else if (result instanceof Error) return result
                return true
            })
            .catch(error=>error)
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
            .catch(error=>error)
    }
    saveCredentials(credentials: Credentials): Promise<void | Error> {
        if(credentials.username === "error") return Promise.resolve(new Error ("Error with error user"))
        return this.gcpDatastoreInteractor.saveRecordOnGoogleDatastore(keyPathFromKindAndIdentifier("Credentials",credentials.username),credentials)
            .catch(error=>error)
    }
    saveMember(userContract: UserContract): Promise<void | Error> {
        if(userContract.username === "error") return Promise.resolve(new Error ("Error with error user"))
        return this.gcpDatastoreInteractor.saveRecordOnGoogleDatastore(keyPathFromKindAndIdentifier("Users",userContract.username),userContract)
            .catch(error=>error)
    }
    saveMemberClaim(memberClaim: MemberClaim): Promise<void | Error> {
        if(memberClaim.memberUsername === "error") return Promise.resolve(new Error ("Error with error user"))
        return this.gcpDatastoreInteractor.saveRecordOnGoogleDatastore(keyPathFromKindAndIdentifier("MembersClaims",memberClaim.memberUsername+memberClaim.claimId),memberClaim)
            .catch(error=>error)
    }
    isCredentialsValid(credentials: Credentials): Promise<boolean | Error> {
        return this.gcpDatastoreInteractor.retreiveRecordOnGoogleDatastore<Credentials>(keyPathFromKindAndIdentifier("Credentials",credentials.username))
            .then(result=>{
                if (result === undefined) return false
                else if (result instanceof Error) return result
                return (result.password === credentials.password)?true:false
            })
            .catch(error=>error)
    }
}
const keyPathFromKindAndIdentifier= (kind:Kind,identifier:string) => `${kind}/${identifier}`.split("/")
type Kind = "Credentials"|"Users"|"MembersClaims"|"SignedIn_Users"
