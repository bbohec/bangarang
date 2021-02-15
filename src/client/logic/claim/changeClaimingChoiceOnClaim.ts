import type { ClaimingChoice } from "../../interfaces/ClaimingChoice";
import { claims } from "./claims";
export const changeClaimingChoiceOnClaim = (claimId:string, claimingChoice:ClaimingChoice): void => {
    const claimIndex = claims.findIndex(claim => claim.id === claimId)
    if (claimIndex === -1) throw new Error(`Claim with id ${claimId} not found.`)
    if (claimingChoice === "Against") {
        claims[claimIndex].peopleFor--
        claims[claimIndex].peopleAgainst++
    } else {
        claims[claimIndex].peopleFor++
        claims[claimIndex].peopleAgainst--
    }
};
