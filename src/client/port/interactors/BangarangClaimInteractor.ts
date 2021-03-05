import type { ClaimContract } from '../ClaimContract';
export interface BangarangClaimInteractor {
    declareClaim(claim: ClaimContract): void;
}
