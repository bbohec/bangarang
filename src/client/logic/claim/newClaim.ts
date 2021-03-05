import type { UIClaimContract } from "../../interfaces/UIClaimContract"
import {claims} from "./claims"
export const newClaim = (claim:UIClaimContract):void => {
    claims.push(claim);
}