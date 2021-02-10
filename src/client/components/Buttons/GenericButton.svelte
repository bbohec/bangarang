<script lang="ts">
    export let textbutton:string = "CLICK ME!"
    export let size:"medium"|"large"="medium";
    export let onClickAction:()=>void
    export let customClasses=""
    export let color:"light"|"dark"="light"
    const textSizeFromSize = (size:"medium"|"large") => {
        if (size === "large") return "text-2xl"
        return "text-xl"
    }
    const marginTopFromSize = (size:"medium"|"large") => {
        if (size === "large") return "mt-4"
        return ""
    }
    const borderFromSize = (size:"medium"|"large") => {
        if (size === "large") return "border-2"
        return "border"
    }
    const buttonThemeFromColor = (color:"light"|"dark") => {
        if (color === "dark") return "text-bangarang-light border-bangarang-light bg-bangarang-dark"
        return "text-bangarang-dark border-bangarang-dark bg-bangarang-light"
    }
</script>
<button 
    class= "{textSizeFromSize(size)} {marginTopFromSize(size)} {customClasses} {buttonThemeFromColor(color)} my-1 px-1 pb-1  {borderFromSize(size)} rounded-md"
    on:click={onClickAction}
>{textbutton}</button>