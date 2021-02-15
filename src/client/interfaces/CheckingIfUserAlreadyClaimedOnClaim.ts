export interface CheckingIfUserAlreadyClaimedOnClaim {
    checkingStatus: "idle" | "checking..." | "checked";
    userId?: string;
    claimId?: string;
    userClaimed?: "For" | "Against";
}
