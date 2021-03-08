import type { ClaimContract } from '../port/ClaimContract';
import { BangarangClaimInteractor, claimNotFound } from '../port/interactors/BangarangClaimInteractor';
export class FakeBangarangClaimInteractor implements BangarangClaimInteractor {
    constructor(
        public declaredClaims: ClaimContract[] = []
    ){}
    isClaimExist(claim: ClaimContract): Boolean {
        return (this.findClaimByTitle(claim.title))?true:false
    }
    declareClaim(claim: ClaimContract): void {
        this.declaredClaims.push(claim);
    }
    claimWithTitle(title: string): ClaimContract {
        const claimFound = this.findClaimByTitle(title)
        if (claimFound) return claimFound;
        throw new Error(claimNotFound(title));
    }
    private findClaimByTitle(claimTitle: string):ClaimContract|undefined {
        return this.declaredClaims.find(declaredClaim => declaredClaim.title === claimTitle);
    }
}
