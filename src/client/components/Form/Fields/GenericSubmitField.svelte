<script lang="ts">
    export let fieldName:string
    export let fieldId:string
    export let isReadOnly:boolean
    type ButtonType = "Text button"| "Outlined button" | "Contained Button"
    export let buttonType:ButtonType = "Text button"
    export let customClasses=""
    const buttonTypeContainedStyle = (buttonType:ButtonType)=> (buttonType=== "Contained Button")? "text-bangarang-light bg-bangarang-darkEmphasis shadow-md":"text-bangarang-darkEmphasis bg-bangarang-light"
    const buttonTypeOutlinedStyle = (buttonType:ButtonType)=> (buttonType=== "Outlined button")?"border":""
</script>
<section class="flex flex-col items-center">
    <label 
        for={fieldId}
        class="text-xs text-bangarang-lightEmphasis sr-only"
    >{fieldName}</label>
    <input 
        type="submit"
        id={fieldId}
        disabled={isReadOnly}
        value={fieldName}
        class="flex place-content-center {buttonTypeContainedStyle(buttonType)} {buttonTypeOutlinedStyle(buttonType)} {customClasses} my-1 px-5 py-2.5 uppercase font-medium rounded-md"
    >
</section>