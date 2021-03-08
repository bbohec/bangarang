import type { ClaimChoice } from "./ClaimChoice";
export interface ClaimContract {
    type: string;
    title: string;
    peopleClaimed:number;
    peopleClaimedFor:number;
    peopleClaimedAgainst:number;
}

export interface ClaimContractWithMemberPreviousClaimChoice extends ClaimContract {
    previousUserClaimChoice:ClaimChoice
}
