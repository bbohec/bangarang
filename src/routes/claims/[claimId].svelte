<script lang="ts" context="module">
    import {currentClaimIdStore} from "../../client/stores/currentClaimIdStore"
	export async function preload(page:any, session:any) {
        const { claimId } = page.params;
        let claim:ClaimContract;
        currentClaimIdStore.set(claimId)
        declaringClaimStore.subscribe(declaringClaim => {
            if (declaringClaim.declaringClaimStatus === "declaringClaim" && declaringClaim.claimToDeclare) claim = declaringClaim.claimToDeclare
            else claim = retreiveClaimById(claimId)
        })
		return { claim };
	}
</script>
<script lang="ts">
    export let claim:ClaimContract
    import type { ClaimContract } from "../../client/interfaces/ClaimContract";
    import {claimingStore} from "../../client/stores/claimingStore"
    import {declaringClaimStore} from "../../client/stores/declaringClaimStore"
    import { retreiveClaimById } from "../../client/logic/claim/retreiveClaimById";
    import ClaimView from "../../client/views/ClaimView.svelte"
    currentClaimIdStore.set(claim.id)
    claimingStore.subscribe(claiming => {
        if(claiming.claimingStatus === "claimed") claim=retreiveClaimById(claim.id)
    })
</script>
<ClaimView {claim}/>