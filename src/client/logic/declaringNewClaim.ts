import type { ClaimContract } from "../interfaces/ClaimContract"
import { declaringClaimStore } from "../stores/declaringClaimStore"
import { newClaim } from "./claim/newClaim"
import {v1 as uuid} from "uuid"
export const declaringClaim = (claimTitle:string):void => {
    const claim:ClaimContract = {
        title:claimTitle,
        peopleClaimed:0,
        peopleAgainst:0,
        peopleFor:0,
        id:uuid()
    }
    declaringClaimStore.set({declaringClaimStatus:"declaringClaim",claimToDeclare:claim})
    setTimeout(() => claimDeclared(claim), declaringClaimFakeWaitingTime);
}
const claimDeclared = (claim:ClaimContract):void => {
    newClaim(claim)
    declaringClaimStore.set({declaringClaimStatus:"claimDeclared",claimToDeclare:claim})
    setTimeout(()=>declaringClaimStore.set({declaringClaimStatus:"nothing"}),timeOfClaimDeclaredNotification)
}
const timeOfClaimDeclaredNotification = 1500
const declaringClaimFakeWaitingTime = 500;


