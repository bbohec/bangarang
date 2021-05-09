<script lang="ts">
    type ButtonType = "Text button"| "Outlined button" | "Contained Button"
    export let buttonType:ButtonType = "Text button"
    export let svgOptionalIcon:string|undefined = undefined
    export let textLabel:string
    export let onClickAction:()=>void
    export let customClasses=""
    export let disabled:boolean=false
    const buttonTypeContainedStyle = (buttonType:ButtonType)=> (buttonType=== "Contained Button")? "text-bangarang-light bg-bangarang-darkEmphasis shadow-md":"text-bangarang-darkEmphasis"
    const buttonTypeOutlinedStyle = (buttonType:ButtonType)=> (buttonType=== "Outlined button")?"border":""
</script>
<button 
    class= "flex place-content-center {buttonTypeContainedStyle(buttonType)} {buttonTypeOutlinedStyle(buttonType)} {customClasses} my-1 px-5 py-2.5 uppercase font-medium rounded-md"
    disabled = {disabled}
    on:click={onClickAction}
>{#if svgOptionalIcon !== undefined}{@html svgOptionalIcon}{/if}{textLabel}
</button>
