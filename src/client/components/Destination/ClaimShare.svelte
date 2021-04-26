<script lang="ts">
    import { shareClaimMessage } from "../../logic/messages";
    export let copyUriToClipboard:()=>void
    import GenericDestination from "../Destination/GenericDestination.svelte"
    import { share } from "../Icons/heroicon";
</script>
<GenericDestination
    onClickAction = {copyUriToClipboard}
    destinationMessage={shareClaimMessage}
    svgHtml = {share}
/>
