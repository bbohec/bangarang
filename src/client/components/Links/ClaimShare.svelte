<script lang="ts">
    const copyUriToClipboard = ():void => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {URICopiedToClipboard = true;})
            .catch((error:Error) => {
                URICopiedToClipboard = false
                URICopyToClipboardError=error
            });   
    }
    let URICopiedToClipboard:boolean=false;
    let URICopyToClipboardError:Error|undefined = undefined;
</script>
<section class="mb-2">
    <p on:click={copyUriToClipboard} class="text-center underline text-sm text-bangarang-darkEmphasis cursor-pointer">Would you like to share this claim?</p>
    {#if URICopiedToClipboard}
        <p class="text-center text-xs text-bangarang-success">Claim address copied to clipboard.</p>
    {:else}
        {#if URICopyToClipboardError !== undefined}
        <p class="text-center text-xs text-bangarang-failed">Failed to copy claim address to clipboard: {URICopyToClipboardError.message}</p>
        {/if}
    {/if}
</section>
