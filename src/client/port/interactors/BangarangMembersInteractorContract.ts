import type { Credentials } from "../bangarangMemberCredential";
import type { ClaimChoice } from "../ClaimChoice";
import type { MemberClaim } from "../MemberClaim";
import type { UserContract } from "../UserContact";
export interface BangarangMembersInteractorContract {
    isMemberExistWithUsername(username: string):boolean|Error;
    isSignedIn(username: string): boolean|Error;
    retrievePreviousMemberClaimChoiceOnClaim(username: string, claimTitle: string): ClaimChoice|Error;
    saveCredentials(credentials:Credentials):void|Error;
    saveMember(userContract: UserContract):void|Error;
    saveMemberClaim(memberClaim: MemberClaim):void|Error;
    signingIn(credentials:Credentials):void|Error;
}
export const bangarangMemberNotFoundError = (username: string): string => `Bangarang member with username '${username}' not found`;
