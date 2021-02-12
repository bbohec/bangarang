import {claimingStore} from "../../stores/claimingStore"
const timeOfClaimedNotification = 1500
export const claimed = ():void => {
    claimingStore.set({claimingStatus:"claimed"})
    setTimeout(()=>claimingStore.set({claimingStatus:"nothing"}),timeOfClaimedNotification)
}