<script lang="ts">
    import { shareClaimMessage } from "../../../logic/messages";
    export let copyUriToClipboard:()=>void
    import GenericInteractiveAction from "./GenericInteractiveAction.svelte"
    import { share } from "../../Icons/heroicon";
</script>
<GenericInteractiveAction
    onClickAction = {copyUriToClipboard}
    destinationMessage={shareClaimMessage}
    svgHtml = {share}
/>
