import type { ClaimContract } from '../port/ClaimContract';
import { BangarangClaimInteractorContract, bangarangClaimNotFoundById, bangarangClaimNotFoundByTittleUpperCase } from '../port/interactors/BangarangClaimInteractorContract';
export class FakeBangarangClaimInteractor implements BangarangClaimInteractorContract {
    constructor(private forceErrorKeyword?:string){}
    public claimByTitleUpperCase(claimTitle: string): ClaimContract | Error {
        const claimFound = this.declaredClaims.find(declaredClaim => declaredClaim.title.toUpperCase() === claimTitle.toUpperCase())
        if (claimFound) return claimFound;
        return new Error(bangarangClaimNotFoundByTittleUpperCase(claimTitle.toUpperCase()));
    }
    public isClaimExistByTitleUpperCase(claimTitle: string): boolean | Error {
        if (this.forceErrorKeyword && this.forceErrorKeyword === claimTitle) return new Error(`Error, claim with title '${claimTitle}' not supported.`)
        return (this.findClaimByTitleUpperCase(claimTitle))?true:false
    }
    public saveClaim(claimToSave: ClaimContract): void|Error {
        if (this.forceErrorKeyword && this.forceErrorKeyword === claimToSave.title) return new Error(`Error, claim with title '${claimToSave.title}' not supported.`)
        const existingClaimIndex = this.declaredClaims.findIndex(claim=> claim.title === claimToSave.title)
        if (existingClaimIndex > -1) this.declaredClaims[existingClaimIndex] = claimToSave
        else this.declaredClaims.push(claimToSave)
    }
    public retrieveClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords(searchCriteriaWords: string[]): ClaimContract[]|Error {
        if (this.forceErrorKeyword && searchCriteriaWords.includes(this.forceErrorKeyword)) return new Error(`Error, search criteria containing '${searchCriteriaWords}' not supported.`)
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
