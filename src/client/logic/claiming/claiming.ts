import type { ClaimingChoice } from "../../interfaces/ClaimingChoice"
import {claimingStore} from "../../stores/claimingStore"
export const claiming = (claimId:string,claimChoice:ClaimingChoice):void => {
    claimingStore.set({claimingStatus:"claiming",claimId,claimChoice})
}
