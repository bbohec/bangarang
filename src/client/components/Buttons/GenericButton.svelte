<script lang="ts">
    export let textbutton:string = "CLICK ME!"
    export let size:"medium"|"large"="medium";
    export let onClickAction:()=>void
    export let customClasses=""
    export let color:"light"|"dark"="light"
    export let disabled:boolean=false
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
    const buttonThemeFromColorAndDisabled = (color:"light"|"dark",disabled:boolean) => {
        if (color === "dark" && !disabled) return "text-bangarang-light border-bangarang-light bg-bangarang-dark"
        if (color === "dark" && disabled) return "text-bangarang-darkEmphasis border-bangarang-darkEmphasis bg-bangarang-darkEmphasis"
        if (color === "light" && disabled) return "text-bangarang-lightEmphasis border-bangarang-lightEmphasis bg-bangarang-light"
        return "text-bangarang-dark border-bangarang-dark bg-bangarang-light"
    }
</script>
{#if disabled}
    <button 
        class= "{textSizeFromSize(size)} {marginTopFromSize(size)} {customClasses} {buttonThemeFromColorAndDisabled(color,disabled)} my-1 px-1 pb-1  {borderFromSize(size)} rounded-md"
        disabled
        on:click={onClickAction}
    >{textbutton}</button>
{:else}
    <button 
        class= "{textSizeFromSize(size)} {marginTopFromSize(size)} {customClasses} {buttonThemeFromColorAndDisabled(color,disabled)} my-1 px-1 pb-1  {borderFromSize(size)} rounded-md"
        on:click={onClickAction}
    >{textbutton}</button>
{/if}
