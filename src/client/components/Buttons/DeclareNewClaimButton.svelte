<script lang="ts">
    import { goto } from '@sapper/app';
    import GenericButton from './GenericButton.svelte'
    const textbutton = `Declare new claim`
    const newClaimUrl ="newClaim"
    const navigateToUrl = ():void => goto(newClaimUrl)
</script>
<GenericButton {textbutton} onClickAction={navigateToUrl}/>