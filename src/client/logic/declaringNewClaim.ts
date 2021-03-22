import {v1 as uuid} from "uuid"
import { declaringClaimUserNotificationStore } from "../stores/declaringClaimStore"
import { executingDeclaringClaimUserNotification } from "../port/interactors/DeclaringClaimUserNotificationInteractorContract"
import { uiBangarangUserBuilder } from "../adapters/uiPrimaryAdapter"
import type { ClaimContract } from "../port/ClaimContract"
export const declaringClaim = (claimTitle:string):void => {
    const claimToDeclare:ClaimContract={
        title:claimTitle,
        type:"Simple",
        peopleClaimed:0,
        peopleClaimedAgainst:0,
        peopleClaimedFor:0,
        id:uuid()
    }
    declaringClaimUserNotificationStore.set(executingDeclaringClaimUserNotification(claimToDeclare))
    setTimeout(() => uiBangarangUserBuilder.getUser().declaringClaim(claimToDeclare.title,claimToDeclare.type,claimToDeclare.id), declaringClaimFakeWaitingTime);
}
const declaringClaimFakeWaitingTime = 500;


