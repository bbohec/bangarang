import type { ClaimContract } from '../port/ClaimContract';
import type { BangarangClaimInteractorContract } from '../port/interactors/BangarangClaimInteractorContract';
import type { RestInteractor } from './RestInteractor';
export class RestBangarangClaimInteractor implements BangarangClaimInteractorContract {
    constructor(private restInteractor:RestInteractor){}
    public specificReset():Promise<void> {
        return this.restInteractor.post(`/reset`,{})
            .then(result => {if(result instanceof Error) throw result})
    }
    claimById(id: string): Promise<ClaimContract | Error> {
        return this.restInteractor.get<ClaimContract>(`/claims`,{id})
    }
    claimByTitleUpperCase(claimTitle: string): Promise<ClaimContract | Error> {
        return this.restInteractor.get<ClaimContract>(`/claims`,{claimTitle})
    }
    isClaimExistByTitleUpperCase(claimTitle: string): Promise<boolean | Error> {
        return this.restInteractor.get<{isClaimExistByTitleUpperCase?:boolean}>(`/isClaimExistByTitleUpperCase`,{claimTitle})
            .then(data => (data instanceof Error)
                ?data:
                (data.isClaimExistByTitleUpperCase !== undefined)
                ?data.isClaimExistByTitleUpperCase:
                new Error ("isMemberExistWithUsername missing on body.")
            )
    }
    retrieveClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords(searchCriteriaWords: string[]): Promise<ClaimContract[]|Error> {
        return this.restInteractor.get<ClaimContract[]>(`/claims`,{searchCriteriaWords:searchCriteriaWords.join(",")})
    }
    saveClaim(claimToSave: ClaimContract): Promise<void | Error> {
        return this.restInteractor.post(`/saveClaim`,claimToSave)
    }
}
