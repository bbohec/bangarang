<script lang="ts">
    import { claimingStore } from "../../stores/claimingStore";
    import {connectedUserStore} from "../../stores/connectedUserStore"
    import GenericButton from "./GenericButton.svelte"
    import {claimButtonInteracted} from "../../logic/claim/claimButtonInteracted"
    export let claimId:string;
    let connectedUserId:string|null = null;
    connectedUserStore.subscribe(connectedUser => {(connectedUser === null)? connectedUserId = null: connectedUserId=connectedUser.id})
    const onClickAction=():void=> claimButtonInteracted(claimId,connectedUserId,"For")
</script>
{#if $claimingStore.claimingStatus === "nothing"}
    <GenericButton textbutton="For" onClickAction={onClickAction} disabled={false}/>
{:else}
    <GenericButton textbutton="For" onClickAction={onClickAction} disabled={true}/>
{/if}