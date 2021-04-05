import type { ClaimContract } from '../port/ClaimContract';
import type { BangarangClaimInteractorContract } from '../port/interactors/BangarangClaimInteractorContract';
import type { RestInteractor } from './RestInteractor';
export class RestBangarangClaimInteractor implements BangarangClaimInteractorContract {
    constructor(private restInteractor:RestInteractor){}
    claimById(id: string): Promise<ClaimContract | Error> {
        return this.restInteractor.get<ClaimContract>(`/claims/${id}`)
    }
    claimByTitleUpperCase(claimTitle: string): Promise<ClaimContract | Error> {
        throw new Error('Method not implemented.');
    }
    isClaimExistByTitleUpperCase(claimTitle: string): Promise<boolean | Error> {
        throw new Error('Method not implemented.');
    }
    retrieveClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords(searchCriteriaWords: string[]): Error | ClaimContract[] {
        throw new Error('Method not implemented.');
    }
    saveClaim(claimToSave: ClaimContract): void | Error {
        throw new Error('Method not implemented.');
    }

}
