<script lang="ts">
    const placeholder=`Describe the claim ...`
    const rows = 10
    export let value = ""
</script>
<textarea class="w-full border rounded p-1 m-1 placeholder-bangarang-lightEmphasis text-bangarang-darkEmphasis border-bangarang-lightEmphasis" {placeholder} {rows} bind:value></textarea>