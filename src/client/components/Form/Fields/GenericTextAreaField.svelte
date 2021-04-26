<script lang="ts">
    export let fieldId:string
    export let fieldName:string
    export let placeholder:string
    export let isRequired:boolean
    export let isReadOnly:boolean
    const rows:number=10
</script>
<label 
    for={fieldId} 
    class="text-xs text-bangarang-lightEmphasis"
>{fieldName}</label>
<textarea 
    readonly={isReadOnly} 
    name={fieldName} 
    id={fieldId} 
    required={isRequired} 
    {placeholder}
    {rows} 
    class="text-xl w-full text-center mx-5 my-1 text-bangarang-dark placeholder-bangarang-darkEmphasis border-bangarang-lightEmphasis border rounded-md"
></textarea>