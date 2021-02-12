<script lang="ts">
    import { claiming } from "../../logic/claiming/claiming";
    import { claimingStore } from "../../stores/claimingStore";
    import GenericButton from "./GenericButton.svelte"
    export let claimId:string;
    const againstClaimButtonClicked = ():void => claiming(claimId,"Against")
</script>
{#if $claimingStore.claimingStatus === "nothing"}
    <GenericButton textbutton="Against" onClickAction={againstClaimButtonClicked} disabled={false}/> 
{:else}
    <GenericButton textbutton="Against" onClickAction={againstClaimButtonClicked} disabled={true}/>
{/if}
