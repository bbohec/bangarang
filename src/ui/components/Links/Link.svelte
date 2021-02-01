<script lang="ts">
    import {link} from "svelte-routing"
    export let linkName:string = "link name not provided to component!"
    export let linkHref:string = "missing"
    export let size:'small'|'medium'
</script>
<a 
    class="{(size === "small")?"text-xs":""} text-bangarang-darkEmphasis underline text-center mb-1" 
    href={linkHref}
    use:link
>{linkName}</a>