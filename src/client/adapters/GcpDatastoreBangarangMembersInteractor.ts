import type { MemberClaim } from "../port/MemberClaim";
import type { UserContract } from "../port/UserContact";
import type { ClaimChoice } from "../port/ClaimChoice";
import type { BangarangMembersInteractorContract } from "../port/interactors/BangarangMembersInteractorContract";
import type { Credentials } from "../port/bangarangMemberCredential";
import {Datastore,DatastoreOptions,PathType,Entity,} from '@google-cloud/datastore'
import type { entity } from "@google-cloud/datastore/build/src/entity";
const bangarangPrivateKey:string = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFn4dnGWOcijgC\nzesWMOgv8wOUn4OM210bI+IQ3Gh1Wl9RtggiWHtKsKU3cumJKj39o1Z2c11J+tJQ\nw45gxk3HQoZmczJZ5G8KZkZ9RAMsm9rW7HUcxPC+Z2qePlzWEZXBxhkLVgJU20Yb\n4PrEkpN1Yuf2dfU9RKQWWIf4od8ufrZR5FLymIU/W+smDCjlxaWlcN3N+vNlkF5H\n4XLeupj3+lqO/fmpxL4OFA2PDlGJuD00aMhJCQ/l1jpO3g7cYA7tjYZXg77ODuLh\nx3+syQYHiNJpb/pdi5ELtimc4qNdDb+q3oBiFOu5CVUxBfvcUdurM5/MyJdeGz7q\nvFVe/MMfAgMBAAECggEAMXtfwmNbizMaki0wG0bUpEjjUR/dpvO4LNb/wDwH1bZy\nnnmHMN5ZxJpVS/x0WBlhGzR+Ljt1lNP+PCWy7S1KBUX1dAqNBXAKk56HMM9KQi2m\nDmF3c2QmaW5ohkXUJe+SQUoSNEHtZITg2ZMsBvMyg9ZngVEIvjYFJek15n3VbYTw\n7F1uzl69yk16drQFeZE4C9nGYdoFFK9AoIq5YuBsuZJ/8cRY++vdZc/d39Hwi8WM\nd+XIPpacgEzahCPVNnmsJgulyAe2YqIQb70G0kA+L8IE5ccpr2K9ahFwvsFpLKTl\nE/71cLMwIXCaSOWngPg5gYEUelZpbbE/vTvng4JNqQKBgQDrm2km5Wa9QQzT/QrQ\nG8ue1AjIwnliLpV+f9f/gW8hSe5svLFxB8zJ8kfOr9+1lmiJuPhtp6Bpx4Z5N54P\nd9GKi6OsLmbXXIEULvWEE7dMkkNKNrGp7t3fvEeNetWTW1ejc7FgdxTqQQsjIdDj\n3BkRW+ltavLC5umC4ZivPBFMxwKBgQDWungokV7tXT4w1A1BVPffOOePUkfChISl\npAZk3qqtVq3XPjpc3lSB9JLRAjVlyAyPRhScnaK6nn9C5Y5mviVH0SxWXOpJ8ux2\ntKtkvBGFydsCBQRKssTc4NdBL4EUD+Awj4HIcTgD1IpjTZZ7mAtif7yM5BpeF/D6\nHHle/Z0O6QKBgBI6DaJysMYHWES2GLYM0G3THXLaiKVt0SbeIQmlK8G5hHZpCpkh\n71fYJHH67SWRIzk0VBO3mhNU2jRadyHfNRiwwNK7LD2Q7HNxRpEXLWEBF6+QF6J7\n1jJO0IJDdG5X7Km6c4hw7e9JZOEs5ooaJt5O6/oJAgrN7lavuS4lSXlVAoGAJPwJ\nJjOjvg6JX6+meNJBv1j1yWHKql5Y2o7d6xHPI/wCBUjalJRWyetuPkG7IMTMJQFV\nG4SrOqmCEeuoE1o84ZnNoTJvyDznLasAumEKQ5j49+gVTShtb/3qFXgxK1twqeyN\n1hBqLX62N1RtzuvpShXmS/4d7IcDIpE09n+IRcECgYEAkdSraAmC250Bjz+WM3p+\nCpvQAZwy6KQNJBMMjMWWpA8FUTTKeGPuOkv1PB38Vz+e/3GSmPuOvZ5qJutUTmBL\n16GRsL96lHizJr1RvoN20JYg9Vzo7agIWbk3p2yvCNQi4zLzWhuSMB8bqVcTkiGk\nV76c6Sphhk93GhOP1g2JDlA=\n-----END PRIVATE KEY-----\n"
const bangarangClientEmail="publicdatastore@bangarang-309019.iam.gserviceaccount.com"
const datastoreOptions:DatastoreOptions = {
    projectId:"bangarang-309019",
    credentials:{
        client_email:bangarangClientEmail,
        private_key:bangarangPrivateKey
    }
} 
const datastore = new Datastore(datastoreOptions)
export class GcpDatastoreBangarangMembersInteractor implements BangarangMembersInteractorContract {
	reset():Promise<void> {
        const googleDatastoreKeys = [
            "MembersClaims/testclaim",
            "Credentials/test"
        ]
        return Promise.all(googleDatastoreKeys.map(googleDatastoreKey=> this.deleteRecordOnGoogleDatastore(googleDatastoreKey.split("/"))))
            .then(results => {
                const errors:Error[] = []
                results.forEach(result=> {if (result instanceof Error) errors.push(result)})
                if (errors.length > 0) throw new Error(`Errors on reset : ${errors.map(error=>error.message)}`)
            })
	}
    isMemberExistWithUsername(username: string): Promise<boolean | Error> {
        return this.retreiveRecordOnGoogleDatastore<UserContract>(keyPathFromKindAndIdentifier("MembersClaims",username))
            .then(result => {
                if (!result) return false
                else if (result instanceof Error) return result
                return true
            })
    }
    isSignedIn(username: string): Promise<boolean | Error> {
        return Promise.resolve( new Error("Method not implemented."))
    }
    retrievePreviousMemberClaimChoiceOnClaim(username: string, claimTitle: string): Promise<ClaimChoice | Error> {
        return this.retreiveRecordOnGoogleDatastore<MemberClaim>(keyPathFromKindAndIdentifier("MembersClaims",username+claimTitle))
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
        return this.saveRecordOnGoogleDatastore(keyPathFromKindAndIdentifier("Credentials",credentials.username),credentials)
    }
    saveMember(userContract: UserContract): Promise<void | Error> {
        if(userContract.username === "error") return Promise.resolve(new Error ("Error with error user"))
        return this.saveRecordOnGoogleDatastore(keyPathFromKindAndIdentifier("Users",userContract.username),userContract)
    }
    saveMemberClaim(memberClaim: MemberClaim): Promise<void | Error> {
        if(memberClaim.memberUsername === "error") return Promise.resolve(new Error ("Error with error user"))
        return this.saveRecordOnGoogleDatastore(keyPathFromKindAndIdentifier("MembersClaims",memberClaim.memberUsername+memberClaim.claimTitle),memberClaim)
    }
    signingIn(credentials: Credentials): Promise<void | Error> {
        if(credentials.username === "error") return Promise.resolve(new Error ("Error with error user"))
        return Promise.resolve( new Error("Method not implemented."))
    }
    private retreiveRecordOnGoogleDatastore<T>(keyPath:PathType[]):Promise<T|undefined|Error> {
        return new Promise<T|undefined|Error>((resolve,reject)=>{
            console.log(`⚙️  retreiveRecordOnGoogleDatastore - ${keyPath.join("/")}`)
            const keyOption:entity.KeyOptions={path:keyPath}
            const key = datastore.key(keyOption);
            datastore.get(key,(error,entity) => {
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
    private deleteRecordOnGoogleDatastore(keyPath:PathType[]):Promise<void|Error> {
        return new Promise<void|Error>((resolve,reject)=>{
            console.log(`⚙️  deleteRecordOnGoogleDatastore - ${keyPath.join("/")}`)
            const keyOption:entity.KeyOptions={path:keyPath}
            const key = datastore.key(keyOption);
            datastore.delete(key,(error) => {
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
    private saveRecordOnGoogleDatastore(keyPath:PathType[],entity:Entity):Promise<void|Error> {
        return new Promise<void|Error>((resolve,reject)=>{
            console.log(`⚙️  saveRecordOnGoogleDatastore - ${keyPath.join("/")}`)
            const keyOption:entity.KeyOptions={path:keyPath}
            const key = datastore.key(keyOption);
            const callback = (error?:Error) => {
                if (error){ 
                    console.log(`❌  ${error.message}`)
                    resolve(error)
                }else {
                    console.log(`✔️  Entity with key path ${keyPath.join("/")} saved on datastore.`)
                    resolve()
                }
            }
            datastore.save({key: key,data: entity},()=>callback() ) 
        })
    }
}
const keyPathFromKindAndIdentifier= (kind:Kind,identifier:string) => `${kind}/${identifier}`.split("/")
type Kind = "Credentials"|"Users"|"MembersClaims"
const noEntityWithPathErrorMessage = (keyPath:PathType[]):string => `No entity with path ${keyPath.join("/")}`