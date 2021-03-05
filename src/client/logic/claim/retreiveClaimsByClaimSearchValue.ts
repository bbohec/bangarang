import type { UIClaimContract } from "../../interfaces/UIClaimContract"
import { claims } from "./claims"
export const retreiveClaimsByClaimSearchValue = (claimSearchValue:string):Array<UIClaimContract> => {
    return claims.filter(claim => claim.title.includes(claimSearchValue))
}
