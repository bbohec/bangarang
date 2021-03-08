import type { ClaimContract } from '../ClaimContract';
export interface BangarangClaimInteractor {
    claimByTitle(title: string): ClaimContract|Error;
    isClaimExistByTitleUpperCase(claim: ClaimContract):Boolean;
    declareClaim(claim: ClaimContract): void;
}
export function bangarangClaimNotFound(title: string): string | undefined {
    return `Claim with title ${title} not found.`;
}