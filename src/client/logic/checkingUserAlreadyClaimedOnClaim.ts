import type { ClaimingChoice } from "../interfaces/ClaimingChoice"
import { checkingIfUserAlreadyClaimedOnClaimStore } from "../stores/checkingUserAlreadyClaimedOnClaimStore"
import { isUserAlreadyClaimed } from "./user/isUserAlreadyClaimed"
export const checkingUserAlreadyClaimedOnClaim = (connectedUserId:string|null,claimId:string):void => {
    if (connectedUserId === null) idle()
    else {
        checkingIfUserAlreadyClaimedOnClaimStore.set({checkingStatus:"checking..."})
        const userAlreadyClaimed = isUserAlreadyClaimed(connectedUserId,claimId)
        setTimeout(() => checked(connectedUserId,claimId,userAlreadyClaimed), claimingFakeWaitingTime);
    }
}
const checked = (connectedUserId:string,claimId:string,userAlreadyClaimed:ClaimingChoice|undefined):void => {
    checkingIfUserAlreadyClaimedOnClaimStore.set({checkingStatus:"checked",userId:connectedUserId,claimId:claimId,userClaimed:userAlreadyClaimed})
    setTimeout(()=>checkingIfUserAlreadyClaimedOnClaimStore.set({checkingStatus:"idle",userId:connectedUserId,claimId:claimId,userClaimed:userAlreadyClaimed}),timeOfClaimedNotification)
}
const idle = () => checkingIfUserAlreadyClaimedOnClaimStore.set({checkingStatus:"idle"})
const timeOfClaimedNotification = 0
const claimingFakeWaitingTime = 500;



