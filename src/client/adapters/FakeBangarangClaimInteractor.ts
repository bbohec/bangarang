import type { ClaimContract } from '../port/ClaimContract';
import type { BangarangClaimInteractor } from '../port/interactors/BangarangClaimInteractor';
import { claimNotFound } from '../../tests/acceptance/declaringClaim.spec';

export class FakeBangarangClaimInteractor implements BangarangClaimInteractor {
    declareClaim(claim: ClaimContract): void {
        this.declaredClaims.push(claim);
    }
    claimWithTitle(title: string): ClaimContract {
        const claimFound = this.declaredClaims.find(claim => claim.title === title);
        if (claimFound)
            return claimFound;
        throw new Error(claimNotFound(title));
    }
    private declaredClaims: ClaimContract[] = [];
}
