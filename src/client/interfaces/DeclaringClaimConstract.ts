import type { UIClaimContract } from './UIClaimContract';
import type { DeclaringClaimStatus } from './DeclaringClaimStatus';
export interface DeclaringClaimConstract {
    declaringClaimStatus: DeclaringClaimStatus;
    claimToDeclare?:UIClaimContract
}
