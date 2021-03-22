import { claiming } from "../claiming"
import { goto } from '@sapper/app';
import type { ClaimingChoice } from "../../interfaces/ClaimingChoice";
import type { ClaimChoice } from "../../port/ClaimChoice";
export const claimButtonInteracted = (claimId:string,claimingChoice:ClaimChoice):void => {
    //if(connectedUserId !== null)claiming(claimId,connectedUserId,claimingChoice)
    //else goto('/SignIn')
}