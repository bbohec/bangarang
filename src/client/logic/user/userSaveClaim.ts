import type { ClaimingChoice } from "../../interfaces/ClaimingChoice";
import {users} from "./users"
export const userSaveClaim = (connectedUserId: string, claimId: string, claimingChoice: ClaimingChoice) => {
    users.map(user => {
        if (user.id === connectedUserId) {
            const claimedClaimIndex = user.claimedClaims.findIndex(claimedClaim => claimedClaim.claimId === claimId)
            if (claimedClaimIndex > -1) user.claimedClaims[claimedClaimIndex].claimingChoice = claimingChoice
            else user.claimedClaims.push({claimId,claimingChoice})
        }
        return user
    })
};
