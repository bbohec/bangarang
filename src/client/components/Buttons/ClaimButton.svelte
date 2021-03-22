<script lang="ts">
    import { claimingUserNotificationStore } from "../../stores/claimingStore";
    import {declaringClaimUserNotificationStore} from "../../stores/declaringClaimStore"
    import GenericButton from "./GenericButton.svelte"
    import type { ClaimChoice } from "../../port/ClaimChoice";
    import { claiming } from "../../logic/claiming";
    export let claimId:string;
    export let claimingChoice:ClaimChoice;
    export let userClaimingChoice:ClaimChoice
    const onClickAction=():void=> claiming(claimId,claimingChoice)
</script>
{#if $claimingUserNotificationStore.status === "Idle" && $declaringClaimUserNotificationStore.status === "Idle"}
    {#if userClaimingChoice === claimingChoice}
        <GenericButton textbutton={claimingChoice} onClickAction={onClickAction} disabled={true}/>
    {:else}
        <GenericButton textbutton={claimingChoice} onClickAction={onClickAction} disabled={false}/> 
    {/if}
{:else} 
    <GenericButton textbutton={claimingChoice} onClickAction={onClickAction} disabled={true}/>
{/if}
