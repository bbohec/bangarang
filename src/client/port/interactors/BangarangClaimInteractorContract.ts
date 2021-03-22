import type { ClaimContract } from '../ClaimContract';
export interface BangarangClaimInteractorContract {
    saveClaim(claimToSave: ClaimContract):void|Error;
    retrieveClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords(searchCriteriaWords: string[]):ClaimContract[]|Error;
    claimByTitle(title: string): ClaimContract|Error;
    isClaimExistByTitleUpperCase(claim: ClaimContract):boolean|Error;
}
export function bangarangClaimNotFound(title: string): string | undefined {
    return `Claim with title ${title} not found.`;
}