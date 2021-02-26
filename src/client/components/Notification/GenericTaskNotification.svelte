<script lang="ts">
    import Spinner from "../Icons/Spinner.svelte"
    import Success from "../Icons/Success.svelte"
    export let runningTaskText:string;
    export let successTaskText:string;
    export let runningCondition:boolean
    export let successCondition:boolean
</script>
{#if runningCondition}
    <p class="text-right text-bangarang-lightEmphasis flex items-center justify-end">{runningTaskText}<Spinner/></p>
{:else if successCondition}
    <p class="text-right text-bangarang-lightEmphasis flex items-center justify-end">{successTaskText}<Success/></p>
{/if}