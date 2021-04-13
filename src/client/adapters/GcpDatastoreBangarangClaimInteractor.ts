import type { PathType } from "@google-cloud/datastore";
import type { Operator } from "@google-cloud/datastore/build/src/query";
import type { ClaimContract } from "../port/ClaimContract";
import type { BangarangClaimInteractorContract } from "../port/interactors/BangarangClaimInteractorContract";
import type { GcpDatastoreInteractor } from "./GcpDatastoreInteractor";

export class GcpDatastoreBangarangClaimInteractor implements BangarangClaimInteractorContract {
    constructor(private gcpDatastoreInteractor:GcpDatastoreInteractor) {}
    reset():Promise<void> {
		const googleDatastoreKeys = [
            "Claims/dsolsdfsldfjsdlfjsdflkjjsf",
        ]
        return Promise.all(googleDatastoreKeys.map(googleDatastoreKey=> this.gcpDatastoreInteractor.deleteRecordOnGoogleDatastore(googleDatastoreKey.split("/"))))
            .then(results => {
                const errors:Error[] = []
                results.forEach(result=> {if (result instanceof Error) errors.push(result)})
                if (errors.length > 0) throw new Error(`Errors on reset : ${errors.map(error=>error.message)}`)
            })
	}
    claimById(id: string): Promise<ClaimContract | Error> {
        return this.gcpDatastoreInteractor.retreiveRecordOnGoogleDatastore<GcpClaimContract>([this.kind,id])
            .then(result=>{
                if (result === undefined) return new Error(`Claim with id '${id}' missing on database.`)
                if (result instanceof Error) return result
                const claim:ClaimContract = {
                    id:result.id,
                    title:result.title,
                    peopleClaimed:result.peopleClaimed,
                    peopleClaimedAgainst:result.peopleClaimedAgainst,
                    peopleClaimedFor:result.peopleClaimedFor,
                    type:result.type
                }
                return claim
            })
    }
    claimByTitleIncencitiveCase(claimTitle: string): Promise<ClaimContract | Error> {
        if(claimTitle.includes("error")) return Promise.resolve(new Error ("claimTitle includes 'error'."))
        const filters:{
            property: string;
            operator: Operator;
            value: {};
        }[] = this.sentenceIntoUniqueWords(claimTitle)
            .map(word=>word.toLocaleLowerCase())
            .map(word=> ({property:incensitiveCaseUniqueWordsPropertyName,operator:"=",value:word}))
        return this.gcpDatastoreInteractor.queryRecordsOnGoogleDatastore<GcpClaimContract>(this.kind,filters)
            .then(results => {
                if (results instanceof Error) throw results
                const gcpClaim = results.find(results => results.title === claimTitle)
                if (!gcpClaim) throw new Error(`No claims found with exact title ${claimTitle}`)
                const claim:ClaimContract = {
                    id:gcpClaim.id,
                    title:gcpClaim.title,
                    peopleClaimed:gcpClaim.peopleClaimed,
                    peopleClaimedAgainst:gcpClaim.peopleClaimedAgainst,
                    peopleClaimedFor:gcpClaim.peopleClaimedFor,
                    type:gcpClaim.type
                }
                return claim
            })
            .catch(error=> error)
    }
    isClaimExistByTitleIncensitiveCase(claimTitle: string): Promise<boolean | Error> {
        return this.claimByTitleIncencitiveCase(claimTitle)
            .then(result => (!(result instanceof Error))?
                true:
                (result.message ===`No claims found with exact title ${claimTitle}`)?false:result)
            .catch(error=>error)
    }
    retrieveClaimsThatContainInIncensitiveCaseTitleOneOrMoreIncencitiveCaseSearchCriteriaWords(searchCriteria: string): Promise<Error | ClaimContract[]> {
        if(searchCriteria.includes("error")) return Promise.resolve(new Error ("Search criteria includes 'error'."))
        return Promise.all(this.sentenceIntoUniqueWords(searchCriteria)
            .map(word => word.toLowerCase())
            .map(word => {
            const filters:{
                property: string;
                operator: Operator;
                value: {};
            }[] = [{property:incensitiveCaseUniqueWordsPropertyName,operator:"=",value:word}]
            return this.gcpDatastoreInteractor.queryRecordsOnGoogleDatastore<GcpClaimContract>(this.kind,filters)
        }))
        .then(resultsOfResults => {
            const claims:ClaimContract[] =[]
            const errors:Error[]=[]
            resultsOfResults.forEach(resultOfResults => {
                if (resultOfResults instanceof Error) errors.push(resultOfResults)
                else resultOfResults.forEach(result=>{
                    if (!claims.some(claim=> claim.id === result.id)) claims.push({
                        id:result.id,
                        title:result.title,
                        peopleClaimed:result.peopleClaimed,
                        peopleClaimedAgainst:result.peopleClaimedAgainst,
                        peopleClaimedFor:result.peopleClaimedFor,
                        type:result.type
                    })
                })
            })
            if (errors.length>0) throw new Error (`Errors while queryRecordsOnGoogleDatastore: ${errors.map(error=>error.message).join(", ")}`)
            return claims
        })
        .catch(error=>error)
    }
    saveClaim(claimToSave: ClaimContract): Promise<void | Error> {
        if (claimToSave.title === "error") return Promise.resolve(new Error("Error claim not supported."))
        const path:PathType[] = [this.kind,claimToSave.id]
        const GcpClaimContract:GcpClaimContract = {
            id:claimToSave.id,
            type:claimToSave.type,
            title:claimToSave.title,
            peopleClaimed:claimToSave.peopleClaimed,
            peopleClaimedAgainst:claimToSave.peopleClaimedAgainst,
            peopleClaimedFor:claimToSave.peopleClaimedFor,
            incensitiveCaseUniqueWords: this.sentenceIntoUniqueWords(claimToSave.title).map(word => word.toLowerCase())
        }
        return this.gcpDatastoreInteractor.saveRecordOnGoogleDatastore(path,GcpClaimContract)
    }
    private sentenceIntoUniqueWords(sentence:string):string[]{
        const words=sentence.split(/\W+/);
        return words.filter(onlyUnique)
        function onlyUnique(value:string, index:number, self:string[]) {
            return self.indexOf(value) === index;
          }

    }
    private kind = "Claims"
}

const incensitiveCaseUniqueWordsPropertyName = "incensitiveCaseUniqueWords"

interface GcpClaimContract extends ClaimContract {
    [incensitiveCaseUniqueWordsPropertyName]:string[]
}

