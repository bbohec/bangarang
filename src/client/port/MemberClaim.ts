export interface MemberClaim {
    claimId: string;
    memberUsername: string;
    claimChoice: "For" | "Against"|undefined;
}
