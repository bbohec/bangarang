import type { Credentials } from "../bangarangMemberCredential";
import type { ClaimChoice } from "../ClaimChoice";
import type { MemberClaim } from "../MemberClaim";
import type { UserContract } from "../UserContact";
export interface BangarangMembersInteractorContract {
    isMemberExistWithUsername(username: string):Promise<boolean|Error>;
    isSignedIn(username: string): Promise<boolean|Error>;
    retrievePreviousMemberClaimChoiceOnClaim(username: string, claimId: string): Promise<ClaimChoice|Error>;
    saveCredentials(credentials:Credentials):Promise<void|Error>;
    saveMember(userContract: UserContract):Promise<void|Error>;
    saveMemberClaim(memberClaim: MemberClaim):Promise<void|Error>;
    signingIn(credentials:Credentials):Promise<void|Error>;
}
export const bangarangMemberNotFoundError = (username: string): string => `Bangarang member with username '${username}' not found`;
