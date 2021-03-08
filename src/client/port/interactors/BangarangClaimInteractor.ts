import type { ClaimContract } from '../ClaimContract';
export interface BangarangClaimInteractor {
    isClaimExist(claim: ClaimContract):Boolean;
    declareClaim(claim: ClaimContract): void;
}
export function claimNotFound(title: string): string | undefined {
    return `Claim with title ${title} not found.`;
}