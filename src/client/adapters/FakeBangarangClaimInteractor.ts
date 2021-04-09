import type { ClaimContract } from '../port/ClaimContract';
import { BangarangClaimInteractorContract, bangarangClaimNotFoundById, bangarangClaimNotFoundByTittleUpperCase } from '../port/interactors/BangarangClaimInteractorContract';
export class FakeBangarangClaimInteractor implements BangarangClaimInteractorContract {
    constructor(private forceErrorKeyword?:string){}
	public reset():Promise<void> {
		this.removeAllClaims()
        return Promise.resolve()
	}
    public claimByTitleUpperCase(claimTitle: string): Promise<ClaimContract | Error> {
        const claimFound = this.declaredClaims.find(declaredClaim => declaredClaim.title.toUpperCase() === claimTitle.toUpperCase())
        if (claimFound) return Promise.resolve(claimFound);
        return Promise.resolve(new Error(bangarangClaimNotFoundByTittleUpperCase(claimTitle.toUpperCase())));
    }
    public isClaimExistByTitleUpperCase(claimTitle: string): Promise<boolean | Error> {
        if (this.forceErrorKeyword && this.forceErrorKeyword === claimTitle) return Promise.resolve(new Error(`Error, claim with title '${claimTitle}' not supported.`))
        return Promise.resolve((this.findClaimByTitleUpperCase(claimTitle))?true:false)
    }
    public saveClaim(claimToSave: ClaimContract): Promise<void|Error> {
        if (this.forceErrorKeyword && this.forceErrorKeyword === claimToSave.title) return Promise.resolve(new Error(`Error, claim with title '${claimToSave.title}' not supported.`))
        const existingClaimIndex = this.declaredClaims.findIndex(claim=> claim.title === claimToSave.title)
        if (existingClaimIndex > -1) this.declaredClaims[existingClaimIndex] = claimToSave
        else this.declaredClaims.push(claimToSave)
        return Promise.resolve()
    }
    public retrieveClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords(searchCriteriaWords: string[]): Promise<ClaimContract[]|Error> {
        if (this.forceErrorKeyword && searchCriteriaWords.includes(this.forceErrorKeyword)) return Promise.resolve(new Error(`Error, search criteria containing '${searchCriteriaWords}' not supported.`))
        return Promise.resolve(this.declaredClaims.filter(claim => searchCriteriaWords.some(searchCriteriaWord => claim.title.toLowerCase().includes(searchCriteriaWord.toLowerCase()))))
    }
    public claimById(id: string): Promise<ClaimContract|Error> {
        const claimFound = this.declaredClaims.find(declaredClaim => declaredClaim.id === id)
        if (claimFound) return Promise.resolve(claimFound);
        return Promise.resolve(new Error(bangarangClaimNotFoundById(id)));
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
