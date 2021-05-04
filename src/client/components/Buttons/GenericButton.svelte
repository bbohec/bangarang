<script lang="ts">
    type ButtonType = "Text button"| "Outlined button" | "Contained Button"
    export let buttonType:ButtonType = "Text button"
    export let svgOptionalIcon:string|undefined = undefined
    export let textLabel:string
    export let onClickAction:()=>void
    export let customClasses=""
    export let disabled:boolean=false
    const buttonTypeContainedStyle = (buttonType:ButtonType)=> (buttonType=== "Contained Button")? "text-bangarang-light bg-bangarang-darkEmphasis":"text-bangarang-darkEmphasis"
    const buttonTypeOutlinedStyle = (buttonType:ButtonType)=> (buttonType=== "Outlined button")?"border":""
</script>
<button 
    class= "{buttonTypeContainedStyle(buttonType)} {buttonTypeOutlinedStyle(buttonType)} {customClasses} my-1 px-1 pt-2 pb-3 uppercase font-semibold rounded-md"
    disabled = {disabled}
    on:click={onClickAction}
>{#if svgOptionalIcon !== undefined}{@html svgOptionalIcon}{/if}{textLabel}</button>
