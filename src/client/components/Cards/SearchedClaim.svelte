<script lang="ts">
    export let title:string
    export let claimLink:string
</script>
<div class="border rounded shadow my-2 p-2 border-bangarang-lightEmphasis flex items-center">
    <a href={claimLink} class=" text-bangarang-dark flex-grow text-justify">{title}</a>
</div>
