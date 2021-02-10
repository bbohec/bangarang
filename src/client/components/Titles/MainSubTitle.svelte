<script lang="ts">
    export let title:string;
    export let theme:"light"|"dark"="light"
    const colorFromTheme = (theme:"light"|"dark") => {
        if (theme === "dark") return "text-bangarang-lightEmphasis"
        return "text-bangarang-darkEmphasis"
    }
</script>
<h2 class="text-xl m-4 {colorFromTheme(theme)} font-medium text-right">{title}</h2>