import type { ClaimContract } from "../../interfaces/ClaimContract";
import { claims } from "./claims"
export const retreiveClaimById = (id:string):ClaimContract => claims.find(claim => claim.id === id)