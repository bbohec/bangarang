import type { ClaimContract } from '../port/ClaimContract';
import { BangarangClaimInteractor, bangarangClaimNotFound } from '../port/interactors/BangarangClaimInteractor';
export class FakeBangarangClaimInteractor implements BangarangClaimInteractor {
    public withClaims(claims:ClaimContract[]) {
        this.declaredClaims = claims
    }
    public claimByTitle(title: string): ClaimContract|Error {
        const claimFound = this.findClaimByTitleUpperCase(title)
        if (claimFound) return claimFound;
        return new Error(bangarangClaimNotFound(title));
    }
    public isClaimExistByTitleUpperCase(claim: ClaimContract): Boolean {
        return (this.findClaimByTitleUpperCase(claim.title))?true:false
    }
    public declareClaim(claim: ClaimContract): void {
        this.declaredClaims.push(claim);
    }
    private findClaimByTitleUpperCase(claimTitle: string):ClaimContract|undefined {
        return this.declaredClaims.find(declaredClaim => declaredClaim.title.toUpperCase() === claimTitle.toUpperCase());
    }
    public declaredClaims: ClaimContract[] = []
}
