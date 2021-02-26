import type { ClaimContract } from './ClaimContract';
import type { DeclaringClaimStatus } from './DeclaringClaimStatus';
export interface DeclaringClaimConstract {
    declaringClaimStatus: DeclaringClaimStatus;
    claimToDeclare?:ClaimContract
}
