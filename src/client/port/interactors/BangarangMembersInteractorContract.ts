import type { ClaimChoice } from "../ClaimChoice";
export interface BangarangMembersInteractorContract {
    memberHasClaimedOnClaim(username: string, title: string): ClaimChoice;
    signingIn(username: string, password: string):void|Error;
    isSignedIn(username: string): Boolean;
}
export const bangarangMemberNotFoundError = (username: string): string => `Bangarang member with username '${username}' not found`;
