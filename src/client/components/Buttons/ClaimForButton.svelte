<script lang="ts">
    import GenericButton from "./GenericButton.svelte"
    const forClaimButtonClicked = ():void => {console.log("CLAIMED FOR!")}
</script>
<GenericButton textbutton="For" onClickAction={forClaimButtonClicked}/>