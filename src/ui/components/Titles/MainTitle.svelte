<script lang="ts">
    export let title:string;
    export let size:"medium"|"large" = "medium";
    const headingTextSizeFromSize = (size:"medium"|"large") => {
        if(size === "large") return "text-3xl"
        return "text-xl"
    }
</script>
<h1 class="{headingTextSizeFromSize(size)} mt-4 text-bangarang-dark font-semibold text-center">{title}</h1>