import type { UIClaimContract } from "../../interfaces/UIClaimContract";
import { claims } from "./claims"
export const retreiveClaimById = (id:string):UIClaimContract =>{
    const claim = claims.find(claim => claim.id === id)
    if (claim) return claim
    throw new Error(`Claim with id ${id} not found.`)
}