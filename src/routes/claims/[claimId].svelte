<script lang="ts" context="module">
    import {currentClaimIdStore} from "../../client/stores/currentClaimIdStore"
	export async function preload(page, session) {
        const { claimId } = page.params;
        currentClaimIdStore.set(claimId)
        const claim:ClaimContract=retreiveClaimById(claimId)
		return { claim };
	}
</script>
<script lang="ts">
    import type { ClaimContract } from "../../client/interfaces/ClaimContract";
    import ClaimFooter from "../../client/components/Footers/ClaimFooter.svelte"
    import ClaimHeader from "../../client/components/Headers/ClaimHeader.svelte"
    import ClaimMain from "../../client/components/Mains/ClaimMain.svelte"
    import { retreiveClaimById } from "../../client/logic/claim/retreiveClaimById";
    import {claimingStore} from "../../client/stores/claimingStore"
    export let claim:ClaimContract
    currentClaimIdStore.set(claim.id)
    claimingStore.subscribe(claiming => {
        if(claiming.claimingStatus === "claimed") claim=retreiveClaimById(claim.id)
    })
</script>
<ClaimHeader title={claim.title}/>
<ClaimMain 
    peopleClaimed={claim.peopleClaimed} 
    peopleFor={claim.peopleFor} 
    peopleAgainst={claim.peopleAgainst}
    claimId = {claim.id}
/>
<ClaimFooter/>


