<script lang="ts">
    import { claiming } from "../../logic/claiming/claiming";
    import { claimingStore } from "../../stores/claimingStore";
    import GenericButton from "./GenericButton.svelte"
    export let claimId:string;
    const forClaimButtonClicked = ():void => claiming(claimId,"For")
</script>
{#if $claimingStore.claimingStatus === "nothing"}
    <GenericButton textbutton="For" onClickAction={forClaimButtonClicked} disabled={false}/>
{:else}
    <GenericButton textbutton="For" onClickAction={forClaimButtonClicked} disabled={true}/>
{/if}