<script lang="ts">
    import {link} from "svelte-routing"
    export let linkName:string = "link name not provided to component!"
    export let linkHref:string = "missing"
    export let size:'small'|'medium'|'large'
    export let textAlign:string =  "text-center"
    const textSizeFromSize = (size:string):string => {
        if (size === "small") return "text-xs"
        if (size === "large") return "text-2xl"
        return ""
    }
</script>
<a 
    class="{textSizeFromSize(size)} {textAlign} text-bangarang-darkEmphasis underline mb-1" 
    href={linkHref}
    use:link
>{linkName}</a>