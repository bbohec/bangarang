import type { ClaimContract } from '../ClaimContract';
export interface BangarangClaimInteractorContract {
    saveClaim(claimToSave: ClaimContract):void;
    findClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords(searchCriteriaWords: string[]):ClaimContract[];
    claimByTitle(title: string): ClaimContract|Error;
    isClaimExistByTitleUpperCase(claim: ClaimContract):Boolean;
}
export function bangarangClaimNotFound(title: string): string | undefined {
    return `Claim with title ${title} not found.`;
}