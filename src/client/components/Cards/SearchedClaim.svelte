<script lang="ts">
    export let title:string
    export let claimLink:string
    import { goto } from '@sapper/app';
    //"self-stretch border rounded shadow my-2 p-2 border-bangarang-lightEmphasis flex items-center"
    const navigateToClaim = ():void =>{
        console.log(claimLink)
        goto(claimLink)
    }
    const maxTitleLength = 150
    const titleWithMaxLength = (title.length>maxTitleLength)?`${title.substring(0,maxTitleLength-3)} ...`:title
</script>
<div 
    on:click={navigateToClaim}
    class="flex place-items-center px-1 py-2 cursor-pointer border-bangarang-lightEmphasis"
>
        <p class={"text-justify text-bangarang-dark"}>{titleWithMaxLength}</p>  
</div>