import type { ClaimContract } from "../../interfaces/ClaimContract";
import { claims } from "./claims"
export const retreiveClaimById = (id:string):ClaimContract =>{
    const claim = claims.find(claim => claim.id === id)
    if (claim) return claim
    throw new Error(`Claim with id ${id} not found.`)
}