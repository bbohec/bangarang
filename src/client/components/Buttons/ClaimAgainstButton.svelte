<script lang="ts">
    import GenericButton from "./GenericButton.svelte"
    const againstClaimButtonClicked = ():void => {console.log("CLAIMED AGAINST!")}
</script>
<GenericButton textbutton="Against" onClickAction={againstClaimButtonClicked}/>