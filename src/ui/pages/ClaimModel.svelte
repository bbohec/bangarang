<script lang="ts">
    import ClaimFooter from "../components/Footers/ClaimFooter.svelte"
    import ClaimHeader from "../components/Headers/ClaimHeader.svelte"
    import ClaimMain from "../components/Mains/ClaimMain.svelte"
    import {beforeUpdate} from "svelte"
    import { retreiveClaimById } from "../logic/retreiveClaimById";
    import type { ClaimContract } from "../interfaces/ClaimContract";
    export let id:string
    let claim:ClaimContract
    beforeUpdate(()=> {
        console.log(id)
        claim=retreiveClaimById(id)
        })
</script>
<ClaimHeader title={claim.title}/>
<ClaimMain 
    peopleClaimed={claim.peopleClaimed} 
    peopleFor={claim.peopleFor} 
    peopleAgainst={claim.peopleAgainst}
/>
<ClaimFooter/>


