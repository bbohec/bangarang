<script lang="ts">
    export let title:string;
    export let size:"medium"|"large" = "medium";
    export let theme:"light"|"dark"="light"
    export let position:"left"|"center"|"right"="left"
    const headingTextSizeFromSize = (size:"medium"|"large") => {
        if(size === "large") return "text-3xl"
        return "text-xl"
    }
    const colorFromTheme = (theme:"light"|"dark") => {
        if (theme === "dark") return "text-bangarang-light"
        return "text-bangarang-dark"
    }
</script>
<h1 class="{headingTextSizeFromSize(size)} m-5 {colorFromTheme(theme)} font-semibold text-{position}">{title}</h1>