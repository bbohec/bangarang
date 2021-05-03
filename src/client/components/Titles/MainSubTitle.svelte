<script lang="ts">
    export let title:string;
    export let theme:"light"|"dark"="light"
    export let customClasses =""
    const colorFromTheme = (theme:"light"|"dark") => {
        if (theme === "dark") return "text-bangarang-lightEmphasis"
        return "text-bangarang-darkEmphasis"
    }
</script>
<h2 class="text-xl {colorFromTheme(theme)} font-medium text-right {customClasses}">{title}</h2>