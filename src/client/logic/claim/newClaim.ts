import type { ClaimContract } from "../../interfaces/ClaimContract"
import {claims} from "./claims"
export const newClaim = (claim:ClaimContract):void => {
    claims.push(claim);
}