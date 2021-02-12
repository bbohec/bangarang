import type { ClaimingChoice } from "../interfaces/ClaimingChoice"
import { claimingStore } from "../stores/claimingStore"
import { updateClaim } from "./claim/updateClaim"
export const claiming = (claimId:string,claimChoice:ClaimingChoice):void => {
    claimingStore.set({claimingStatus:"claiming",claimId,claimChoice})
    updateClaim(claimId, claimChoice);
    setTimeout(() => claimed(), claimingFakeWaitingTime);
}
const claimed = ():void => {
    claimingStore.set({claimingStatus:"claimed"})
    setTimeout(()=>claimingStore.set({claimingStatus:"nothing"}),timeOfClaimedNotification)
}
const timeOfClaimedNotification = 1500
const claimingFakeWaitingTime = 500;