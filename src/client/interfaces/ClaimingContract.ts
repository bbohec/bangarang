import type { ClaimingChoice } from "./ClaimingChoice";
import type { ClaimingStatus } from "./ClaimingStatus";
export interface ClaimingContract {
    claimingStatus: ClaimingStatus;
    claimId?: string;
    claimChoice?: ClaimingChoice;
}
