import type { ClaimingChoice } from "../interfaces/ClaimingChoice"
import { claimingStore } from "../stores/claimingStore"
import { userClaimed as addNewClaimingOnClaim } from "./claim/updateClaim"
import { userSaveClaim } from "./user/userSaveClaim"
import {users} from "../logic/user/users"
import { changeClaimingChoiceOnClaim } from "./claim/changeClaimingChoiceOnClaim"
import { isUserAlreadyClaimed } from "./user/isUserAlreadyClaimed"
export const claiming = (claimId:string,connectedUserId:string,claimingChoice:ClaimingChoice):void => {
    claimingStore.set({claimingStatus:"claiming",claimId,claimChoice: claimingChoice})
    const userAlreadyClaimed = isUserAlreadyClaimed(connectedUserId,claimId)
    if (!userAlreadyClaimed) addNewClaimingOnClaim(claimId, claimingChoice); 
    else if (userAlreadyClaimed !== claimingChoice)changeClaimingChoiceOnClaim(claimId,claimingChoice)
    else throw new Error(`User ${connectedUserId} already claimed ${userAlreadyClaimed} on claim ${claimId}`)
    userSaveClaim(connectedUserId,claimId,claimingChoice)
    setTimeout(() => claimed(), claimingFakeWaitingTime);
}
const claimed = ():void => {
    claimingStore.set({claimingStatus:"claimed"})
    setTimeout(()=>claimingStore.set({claimingStatus:"nothing"}),timeOfClaimedNotification)
}
const timeOfClaimedNotification = 1500
const claimingFakeWaitingTime = 500;



