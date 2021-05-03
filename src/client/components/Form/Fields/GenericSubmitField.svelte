<script lang="ts">
    export let fieldName:string
    export let fieldId:string
    export let isReadOnly:boolean
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
        class="text-xl w-32 text-bangarang-dark border-bangarang-dark bg-bangarang-light my-1 px-1 pb-1 border rounded-md"
    >
</section>
