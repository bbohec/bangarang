import type { MemberClaim } from "../port/MemberClaim";
import type { UserContract } from "../port/UserContact";
import type { ClaimChoice } from "../port/ClaimChoice";
import type { BangarangMembersInteractorContract } from "../port/interactors/BangarangMembersInteractorContract";
import type { Credentials } from "../port/bangarangMemberCredential";
import type {Datastore,PathType,Entity,} from '@google-cloud/datastore'
import type { entity } from "@google-cloud/datastore/build/src/entity";

export class GcpDatastoreInteractor {
    constructor(gcpDatastore:Datastore) {
        this.gcpDatastore = gcpDatastore
    }
    public retreiveRecordOnGoogleDatastore<T>(keyPath:PathType[]):Promise<T|undefined|Error> {
        return new Promise<T|undefined|Error>((resolve,reject)=>{
            console.log(`⚙️  retreiveRecordOnGoogleDatastore - ${keyPath.join("/")}`)
            const keyOption:entity.KeyOptions={path:keyPath}
            const key = this.gcpDatastore.key(keyOption);
            this.gcpDatastore.get(key,(error,entity) => {
                if (error){
                    console.log(`❌ ${error.message}`)
                    resolve(error)
                }
                else if (!entity){
                    console.log(`⚠️  ${noEntityWithPathErrorMessage(keyPath)}`)
                    resolve(undefined)
                }
                else {
                    console.log(`✔️  Entity with key path ${keyPath.join("/")} retreived from datastore.`)
                    resolve (entity)
                }
            })
        })
    }
    public deleteRecordOnGoogleDatastore(keyPath:PathType[]):Promise<void|Error> {
        return new Promise<void|Error>((resolve,reject)=>{
            console.log(`⚙️  deleteRecordOnGoogleDatastore - ${keyPath.join("/")}`)
            const keyOption:entity.KeyOptions={path:keyPath}
            const key = this.gcpDatastore.key(keyOption);
            this.gcpDatastore.delete(key,(error) => {
                if (error) {
                    console.log(`❌  ${error.message}`)
                    resolve(error)
                }
                else {
                    console.log(`✔️  Entity with key path ${keyPath.join("/")} deleted on datastore.`)
                    resolve()
                }
            })
        })
    }
    public saveRecordOnGoogleDatastore(keyPath:PathType[],entity:Entity):Promise<void|Error> {
        return new Promise<void|Error>((resolve,reject)=>{
            console.log(`⚙️  saveRecordOnGoogleDatastore - ${keyPath.join("/")}`)
            const keyOption:entity.KeyOptions={path:keyPath}
            const key = this.gcpDatastore.key(keyOption);
            const callback = (error?:Error) => {
                if (error){ 
                    console.log(`❌  ${error.message}`)
                    resolve(error)
                }else {
                    console.log(`✔️  Entity with key path ${keyPath.join("/")} saved on datastore.`)
                    resolve()
                }
            }
            this.gcpDatastore.save({key: key,data: entity},()=>callback() ) 
        })
    }
    private gcpDatastore:Datastore
}


export class GcpDatastoreBangarangMembersInteractor implements BangarangMembersInteractorContract {
    constructor(gcpDatastoreInteractor:GcpDatastoreInteractor) {
        this.gcpDatastoreInteractor = gcpDatastoreInteractor
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
    private gcpDatastoreInteractor:GcpDatastoreInteractor
}
const keyPathFromKindAndIdentifier= (kind:Kind,identifier:string) => `${kind}/${identifier}`.split("/")
type Kind = "Credentials"|"Users"|"MembersClaims"|"SignedIn_Users"
const noEntityWithPathErrorMessage = (keyPath:PathType[]):string => `No entity with path ${keyPath.join("/")}`