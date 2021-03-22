import type { ClaimContract } from '../ClaimContract';
export interface BangarangClaimInteractorContract {
    saveClaim(claimToSave: ClaimContract):void|Error;
    retrieveClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords(searchCriteriaWords: string[]):ClaimContract[]|Error;
    claimById(id: string): ClaimContract|Error;
    isClaimExistByTitleUpperCase(claimTitle: string):boolean|Error;
}
export function bangarangClaimNotFound(id: string): string | undefined {
    return `Claim with id ${id} not found.`;
}