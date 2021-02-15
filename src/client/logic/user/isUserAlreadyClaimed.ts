import type { ClaimingChoice } from "../../interfaces/ClaimingChoice";
import { users } from "./users"
export const isUserAlreadyClaimed = (connectedUserId: string, claimId: string): ClaimingChoice | undefined => {
    const user = users.find(user=> user.id === connectedUserId)
    if (!user) return undefined
    else {
        const userClaimedClaim = user.claimedClaims.find(claimedClaim => claimedClaim.claimId === claimId)
        if (!userClaimedClaim) return undefined
        else return userClaimedClaim.claimingChoice
    }
};
