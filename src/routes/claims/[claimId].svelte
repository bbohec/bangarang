<script lang="ts" context="module">
    import {currentClaimIdStore} from "../../client/stores/currentClaimIdStore"
	export async function preload(page:any, session:any) {
        const { claimId } = page.params;
        let claim:ClaimContractWithMemberPreviousClaimChoice|undefined;
        currentClaimIdStore.set(claimId)
        /*currentClaimIdStore.subscribe(claimId => {
            console.log(`retrievingClaimById(${claimId})`)
            retrievingClaimById(claimId) 
        })*/
        declaringClaimUserNotificationStore.subscribe(declaringClaimUserNotification => {
            if (declaringClaimUserNotification.status === "Executing" && declaringClaimUserNotification.claimToDeclare) {
                claim = {
                    title: declaringClaimUserNotification.claimToDeclare.title,
                    type: declaringClaimUserNotification.claimToDeclare.type,
                    id: declaringClaimUserNotification.claimToDeclare.id,
                    peopleClaimed:declaringClaimUserNotification.claimToDeclare.peopleClaimed,
                    peopleClaimedAgainst:declaringClaimUserNotification.claimToDeclare.peopleClaimedAgainst,
                    peopleClaimedFor:declaringClaimUserNotification.claimToDeclare.peopleClaimedFor,
                    previousUserClaimChoice:undefined
                }
            }
            else {
                //console.log(`retrievingClaimById(${claimId})`)
                retrievingClaimById(claimId)
            }
        })
        retrievingClaimUserNotificationStore.subscribe(retrievingClaimUserNotification => {
            console.log(retrievingClaimUserNotification)
            if(retrievingClaimUserNotification.status === "Success" && retrievingClaimUserNotification.claimWithMemberPreviousClaimChoice) {
                console.log("APPLY CLAIM")
                claim =retrievingClaimUserNotification.claimWithMemberPreviousClaimChoice
                console.log(claim)
            }   
        })
		return { claim };
	}
</script>
<script lang="ts">
    export let claim:ClaimContractWithMemberPreviousClaimChoice|undefined
    import {claimingUserNotificationStore} from "../../client/stores/claimingStore"
    import {declaringClaimUserNotificationStore} from "../../client/stores/declaringClaimStore"
    import ClaimView from "../../client/views/ClaimView.svelte"
    import type {  ClaimContractWithMemberPreviousClaimChoice } from "../../client/port/ClaimContract";
    import { retrievingClaimUserNotificationStore } from "../../client/stores/retrievingClaimStore";
    import { retrievingClaimById } from "../../client/logic/retrievingClaimById";
    //currentClaimIdStore.set(claim.id)
    claimingUserNotificationStore.subscribe(claimingUserNotification => {
        if(claimingUserNotification.status === "Success" && claim) retrievingClaimById(claim.id)
    })
    retrievingClaimUserNotificationStore.subscribe(retrievingClaimUserNotification => {
        console.log(retrievingClaimUserNotification)
        if(retrievingClaimUserNotification.status === "Success" && retrievingClaimUserNotification.claimWithMemberPreviousClaimChoice) {
            console.log("APPLY CLAIM")
            claim =retrievingClaimUserNotification.claimWithMemberPreviousClaimChoice
            console.log(claim)
        }   
    })
</script>
{#if claim}
    <ClaimView {claim}/>
{/if}
