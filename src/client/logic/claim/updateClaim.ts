import type { ClaimingChoice } from "../../interfaces/ClaimingChoice";
import { claims } from "./claims";
export function userClaimed(claimId:string,claimChoice:ClaimingChoice):void {
    claims.map(claim => {
        if (claim.id === claimId) {
            claim.peopleClaimed++;
            (claimChoice === "Against") ? claim.peopleAgainst++ : claim.peopleFor++
        }
        return claim
    })
}