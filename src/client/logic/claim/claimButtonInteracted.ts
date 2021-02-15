import { claiming } from "../claiming"
import { goto } from '@sapper/app';
import type { ClaimingChoice } from "../../interfaces/ClaimingChoice";
export const claimButtonInteracted = (claimId:string, connectedUserId:string|null,claimingChoice:ClaimingChoice):void => {
    if(connectedUserId !== null)claiming(claimId,connectedUserId,claimingChoice)
    else goto('/SignIn')
}