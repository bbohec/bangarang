import type { ClaimContract } from '../port/ClaimContract';
import { BangarangClaimInteractorContract, bangarangClaimNotFoundById, bangarangClaimNotFoundByTittleUpperCase } from '../port/interactors/BangarangClaimInteractorContract';
export class FakeBangarangClaimInteractor implements BangarangClaimInteractorContract {
    public claimByTitleUpperCase(claimTitle: string): ClaimContract | Error {
        const claimFound = this.declaredClaims.find(declaredClaim => declaredClaim.title.toUpperCase() === claimTitle.toUpperCase())
        if (claimFound) return claimFound;
        return new Error(bangarangClaimNotFoundByTittleUpperCase(claimTitle.toUpperCase()));
    }
    public isClaimExistByTitleUpperCase(claimTitle: string): boolean | Error {
        return (this.findClaimByTitleUpperCase(claimTitle))?true:false
    }
    public saveClaim(claimToSave: ClaimContract): void {
        const existingClaimIndex = this.declaredClaims.findIndex(claim=> claim.title === claimToSave.title)
        if (existingClaimIndex > -1) this.declaredClaims[existingClaimIndex] = claimToSave
        else this.declaredClaims.push(claimToSave)
    }
    public retrieveClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords(searchCriteriaWords: string[]): ClaimContract[] {
        return this.declaredClaims.filter(claim => searchCriteriaWords.some(searchCriteriaWord => claim.title.toLowerCase().includes(searchCriteriaWord)))
    }
    public claimById(id: string): ClaimContract|Error {
        const claimFound = this.declaredClaims.find(declaredClaim => declaredClaim.id === id)
        if (claimFound) return claimFound;
        return new Error(bangarangClaimNotFoundById(id));
    }
    public declareClaim(claim: ClaimContract): void {
        this.declaredClaims.push(claim);
    }
    private findClaimByTitleUpperCase(claimTitle: string):ClaimContract|undefined {
        return this.declaredClaims.find(declaredClaim => declaredClaim.title.toUpperCase() === claimTitle.toUpperCase());
    }
    public removeAllClaims():void {
        this.declaredClaims=[]
    }
    public declaredClaims: ClaimContract[] = []
}
