<script lang="ts">
    export let isReadOnly:boolean
    export let fieldName:string
    export let fieldId:string
    export let isRequired:boolean
</script>
<label 
    for={fieldId} 
    class="text-xs text-bangarang-lightEmphasis"
>{fieldName}</label>
<input 
    readonly={isReadOnly} 
    type="password" 
    name={fieldName} 
    id={fieldId} 
    required={isRequired} 
    class="text-xl text-center mx-5 my-1 text-bangarang-dark placeholder-bangarang-darkEmphasis border-bangarang-lightEmphasis border rounded-md"
>