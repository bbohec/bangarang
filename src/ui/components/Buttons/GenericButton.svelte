<script lang="ts">
    export let textbutton:string = "CLICK ME!"
    export let size:"medium"|"large"="medium";
    export let onClickAction:()=>void
    export let width=""
    const textSizeFromSize = (size:"medium"|"large") => {
        if (size === "large") return "text-3xl"
        return "text-xl"
    }
    const marginTopFromSize = (size:"medium"|"large") => {
        if (size === "large") return "mt-4"
        return ""
    }
</script>
<button 
    class= "{textSizeFromSize(size)} {marginTopFromSize(size)} {width}  my-1 px-1 pb-1 text-bangarang-dark border border-bangarang-darkEmphasis rounded-md bg-bangarang-lightEmphasis"
    on:click={onClickAction}
>{textbutton}</button>