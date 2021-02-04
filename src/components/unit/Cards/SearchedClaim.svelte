<script lang="ts">
    import ChevronRight from '../Icons/ChevronRight.svelte'
    export let title:string
</script>
<div class="border rounded my-1 p-1 border-bangarang-lightEmphasis flex items-center">
    <p class=" text-bangarang-dark flex-grow">{title}</p><ChevronRight/>
</div>
