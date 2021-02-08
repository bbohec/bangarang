<script lang="ts">
    import { link } from "svelte-routing";
    export let title:string
    export let claimLink:string
</script>
<div class="border rounded my-1 p-1 border-bangarang-lightEmphasis flex items-center">
    <a href={claimLink} use:link class=" text-bangarang-dark flex-grow">{title}</a>
</div>
