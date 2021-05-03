<script lang="ts">
    export let title:string;
    export let size:"medium"|"large" = "medium";
    export let theme:"light"|"dark"="light"
    export let position:"left"|"center"|"right"="left"
    export let customClasses=""
    const headingTextSizeFromSize = (size:"medium"|"large") => {
        if(size === "large") return "text-3xl"
        return "text-xl"
    }
    const colorFromTheme = (theme:"light"|"dark") => {
        if (theme === "dark") return "text-bangarang-lightEmphasis"
        return "text-bangarang-darkEmphasis"
    }
</script>
<h1 class="{headingTextSizeFromSize(size)} {colorFromTheme(theme)} font-semibold text-{position} {customClasses}">{title}</h1>