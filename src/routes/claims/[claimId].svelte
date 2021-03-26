<script lang="ts" context="module">
    import {currentClaimIdStore} from "../../client/stores/currentClaimIdStore"
	export async function preload(page:any, session:any) {
        const { claimId } = page.params;
        let claim:ClaimContractWithMemberPreviousClaimChoice|undefined;
        retrievingClaimById(claimId) 
        retrievingClaimUserNotificationStore.subscribe(retrievingClaimUserNotification => {
            console.log(retrievingClaimUserNotification)
            if(retrievingClaimUserNotification.status === "Success" && retrievingClaimUserNotification.claimWithMemberPreviousClaimChoice) {
                claim = retrievingClaimUserNotification.claimWithMemberPreviousClaimChoice
                currentClaimIdStore.set(claim.id)
            }
        })
		if (claim) return { claim };
	}
</script>
<script lang="ts">
    export let claim:ClaimContractWithMemberPreviousClaimChoice
    import {claimingUserNotificationStore} from "../../client/stores/claimingStore"
    import ClaimView from "../../client/views/ClaimView.svelte"
    import type {  ClaimContractWithMemberPreviousClaimChoice } from "../../client/port/ClaimContract";
    import { retrievingClaimUserNotificationStore } from "../../client/stores/retrievingClaimStore";
    import { retrievingClaimById } from "../../client/logic/retrievingClaimById";
    import type { RetrievingClaimUserNotificationContract } from "../../client/port/interactors/RetrievingClaimUserNotificationInteractorContract";
    import type { ClaimingUserNotificationContract } from "../../client/port/interactors/ClaimingUserNotificationInteractorContract";
    const shouldRetrieveClaimOnSuccessClaimingNotification=(claimingUserNotification: ClaimingUserNotificationContract)=> {if(claimingUserNotification.status === "Success") retrievingClaimById(claim.id)}
    const shouldAffectClaim=(retrievingClaimUserNotification: RetrievingClaimUserNotificationContract):void=> {if(retrievingClaimUserNotification.status === "Success" && retrievingClaimUserNotification.claimWithMemberPreviousClaimChoice) claim=retrievingClaimUserNotification.claimWithMemberPreviousClaimChoice}
    claimingUserNotificationStore
        .subscribe(claimingUserNotification =>  shouldRetrieveClaimOnSuccessClaimingNotification(claimingUserNotification))
    retrievingClaimUserNotificationStore
        .subscribe(retrievingClaimUserNotification => shouldAffectClaim(retrievingClaimUserNotification))
</script>
{#if claim}
    <ClaimView {claim}/>
{/if}
