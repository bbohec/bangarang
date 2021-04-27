<script lang="ts" context="module">
    import {currentClaimIdStore} from "../../../client/stores/currentClaimIdStore"
    export async function preload(page:any, session:any) {
        const { language,claimId } = page.params;
        return retrievingClaimById(claimId)
                .then(()=>{
                    let claim:ClaimContractWithMemberPreviousClaimChoice|undefined
                    retrievingClaimUserNotificationStore.subscribe(retrievingClaimUserNotification => {
                        if(retrievingClaimUserNotification.status === "Success" && retrievingClaimUserNotification.claimWithMemberPreviousClaimChoice) {
                            claim = retrievingClaimUserNotification.claimWithMemberPreviousClaimChoice
                            currentClaimIdStore.set(claim.id)
                        }
                    })
                    return { language,claimId,claim };
                })
		
	}
	/*
    export async function preload(page:any, session:any) {
        const { claimId,language } = page.params;
		const selectedLanguage:string = language
        return retrieveClaim(claimId)
            .then(claim => {
                return {claim,selectedLanguage}
            })
        function retrieveClaim(claimId:string):Promise<ClaimContractWithMemberPreviousClaimChoice|undefined> {
            return retrievingClaimById(claimId)
                .then(()=>{
                    let claim:ClaimContractWithMemberPreviousClaimChoice|undefined
                    retrievingClaimUserNotificationStore.subscribe(retrievingClaimUserNotification => {
                        if(retrievingClaimUserNotification.status === "Success" && retrievingClaimUserNotification.claimWithMemberPreviousClaimChoice) {
                            claim = retrievingClaimUserNotification.claimWithMemberPreviousClaimChoice
                            currentClaimIdStore.set(claim.id)
                        }
                    })
                    return claim
                })
        }
	}
    */
</script>
<script lang="ts">
    /*
    import type {  ClaimContractWithMemberPreviousClaimChoice } from "../../../client/port/ClaimContract";
    import type { RetrievingClaimUserNotificationContract } from "../../../client/port/interactors/RetrievingClaimUserNotificationInteractorContract";
    import type { ClaimingUserNotificationContract } from "../../../client/port/interactors/ClaimingUserNotificationInteractorContract";
    import {claimingUserNotificationStore} from "../../../client/stores/claimingStore"
    import ClaimView from "../../../client/views/ClaimView.svelte"
    import { retrievingClaimUserNotificationStore } from "../../../client/stores/retrievingClaimStore";
    import { retrievingClaimById } from "../../../client/logic/retrievingClaimById";
    import { assignLanguage, redirectOnUnknownLanguage } from "../../../client/logic/language";
    import { onMount } from "svelte";
    export let claim:ClaimContractWithMemberPreviousClaimChoice
	export let selectedLanguage:string
    
    assignLanguage(selectedLanguage)
	onMount(()=>redirectOnUnknownLanguage(selectedLanguage))
    const shouldRetrieveClaimOnSuccessClaimingNotification=(claimingUserNotification: ClaimingUserNotificationContract)=> {
        if(claimingUserNotification.status === "Success" && claim) retrievingClaimById(claim.id)
    }
    const shouldAffectClaim=(retrievingClaimUserNotification: RetrievingClaimUserNotificationContract):void=> {if(retrievingClaimUserNotification.status === "Success" && retrievingClaimUserNotification.claimWithMemberPreviousClaimChoice) claim=retrievingClaimUserNotification.claimWithMemberPreviousClaimChoice}
    claimingUserNotificationStore
        .subscribe(claimingUserNotification =>  shouldRetrieveClaimOnSuccessClaimingNotification(claimingUserNotification))
    retrievingClaimUserNotificationStore
        .subscribe(retrievingClaimUserNotification => shouldAffectClaim(retrievingClaimUserNotification))
        */
    //
    export let language:string
    export let claimId:string
    import {claimingUserNotificationStore} from "../../../client/stores/claimingStore"
    import ClaimView from "../../../client/views/ClaimView.svelte"
    import type {  ClaimContractWithMemberPreviousClaimChoice } from "../../../client/port/ClaimContract";
    import { retrievingClaimUserNotificationStore } from "../../../client/stores/retrievingClaimStore";
    import { retrievingClaimById } from "../../../client/logic/retrievingClaimById";
    import type { RetrievingClaimUserNotificationContract } from "../../../client/port/interactors/RetrievingClaimUserNotificationInteractorContract";
    import type { ClaimingUserNotificationContract } from "../../../client/port/interactors/ClaimingUserNotificationInteractorContract";
    import { assignLanguage, redirectOnUnknownLanguage } from "../../../client/logic/language";
    import { onMount } from "svelte";
    assignLanguage(language)
	onMount(()=>redirectOnUnknownLanguage(language))
    export let claim:ClaimContractWithMemberPreviousClaimChoice|undefined
    currentClaimIdStore.set(claimId)
    const shouldRetrieveClaimOnSuccessClaimingNotification=(claimingUserNotification: ClaimingUserNotificationContract)=> {if(claimingUserNotification.status === "Success") retrievingClaimById(claimId)}
    if(!claim)retrievingClaimById(claimId)
    claimingUserNotificationStore
        .subscribe(claimingUserNotification =>  shouldRetrieveClaimOnSuccessClaimingNotification(claimingUserNotification))
    const shouldAffectClaim=(retrievingClaimUserNotification: RetrievingClaimUserNotificationContract):void=> {
        if(retrievingClaimUserNotification.status === "Success" && retrievingClaimUserNotification.claimWithMemberPreviousClaimChoice){
            claim=retrievingClaimUserNotification.claimWithMemberPreviousClaimChoice
        }
    }
    retrievingClaimUserNotificationStore
        .subscribe(retrievingClaimUserNotification => shouldAffectClaim(retrievingClaimUserNotification))
</script>
{#if claim}
    <ClaimView {claim}/>
{/if}
