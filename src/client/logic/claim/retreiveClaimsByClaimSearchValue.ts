import type { ClaimContract } from "../../interfaces/ClaimContract"
import { claims } from "./claims"
export const retreiveClaimsByClaimSearchValue = (claimSearchValue:string):Array<ClaimContract> => {
    return claims.filter(claim => claim.title.includes(claimSearchValue))
}
