import type { ClaimContract } from '../ClaimContract';
export interface BangarangClaimInteractorContract {
    claimById(id: string): Promise<ClaimContract|Error>;
    claimByTitleIncencitiveCase(claimTitle: string):Promise<ClaimContract|Error>;
    isClaimExistByTitleIncensitiveCase(claimTitle: string):Promise<boolean|Error>;
    retrieveClaimsThatContainInIncensitiveCaseTitleOneOrMoreIncencitiveCaseSearchCriteriaWords(searchCriteria: string):Promise<ClaimContract[]|Error>;
    saveClaim(claimToSave: ClaimContract):Promise<void|Error>;
}
export const bangarangClaimNotFoundById=(id: string): string | undefined => `Claim with id ${id} not found.`;
export const bangarangClaimNotFoundByTittleUpperCase=(claimTitle: string): string | undefined => `Claim with title like '${claimTitle}' not found.`;