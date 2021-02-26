<script lang="ts">
    import type { ClaimingChoice } from "../../interfaces/ClaimingChoice";
    import { claimingStore } from "../../stores/claimingStore";
    import {declaringClaimStore} from "../../stores/declaringClaimStore"
    import {checkingIfUserAlreadyClaimedOnClaimStore} from "../../stores/checkingUserAlreadyClaimedOnClaimStore"
    import GenericButton from "./GenericButton.svelte"
    import {claimButtonInteracted} from "../../logic/claim/claimButtonInteracted"
    export let claimId:string;
    export let claimingChoice:ClaimingChoice|undefined;
    export let connectedUserId:string|null = null;
    const onClickAction=():void=> claimButtonInteracted(claimId,connectedUserId,claimingChoice)
</script>
{#if $claimingStore.claimingStatus === "nothing" && $declaringClaimStore.declaringClaimStatus === "nothing"}
    {#if $checkingIfUserAlreadyClaimedOnClaimStore.userClaimed === claimingChoice}
        <GenericButton textbutton={claimingChoice} onClickAction={onClickAction} disabled={true}/>
    {:else if $checkingIfUserAlreadyClaimedOnClaimStore.checkingStatus !== "idle"}
        <GenericButton textbutton={claimingChoice} onClickAction={onClickAction} disabled={true}/>
    {:else}
        <GenericButton textbutton={claimingChoice} onClickAction={onClickAction} disabled={false}/> 
    {/if}
{:else} 
    <GenericButton textbutton={claimingChoice} onClickAction={onClickAction} disabled={true}/>
{/if}
