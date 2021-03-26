import type { ClaimContract } from '../ClaimContract';
export interface BangarangClaimInteractorContract {
    claimById(id: string): ClaimContract|Error;
    claimByTitleUpperCase(claimTitle: string):ClaimContract|Error;
    isClaimExistByTitleUpperCase(claimTitle: string):boolean|Error;
    retrieveClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords(searchCriteriaWords: string[]):ClaimContract[]|Error;
    saveClaim(claimToSave: ClaimContract):void|Error;
}
export const bangarangClaimNotFoundById=(id: string): string | undefined => `Claim with id ${id} not found.`;
export const bangarangClaimNotFoundByTittleUpperCase=(claimTitle: string): string | undefined => `Claim with title like '${claimTitle}' not found.`;