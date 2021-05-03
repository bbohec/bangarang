<script lang="ts">
    export let fieldId:string
    export let fieldName:string
    export let placeholder:string
    export let isRequired:boolean
    export let isReadOnly:boolean
    const rows:number=10
</script>
<section class="flex flex-col">
    <label 
        for={fieldId} 
        class="text-bangarang-lightEmphasis"
    >{fieldName}</label>
    <textarea 
        readonly={isReadOnly} 
        name={fieldName} 
        id={fieldId} 
        required={isRequired} 
        {placeholder}
        {rows} 
        class="text-lg resize-none text-center m-1 text-bangarang-dark placeholder-bangarang-darkEmphasis border-bangarang-lightEmphasis border rounded-md"
    ></textarea>
</section>
