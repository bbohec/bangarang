<script lang="ts">
    import NewClaimForm from '../Form/NewClaimForm.svelte'
    import {declaringClaimStore} from '../../stores/declaringClaimStore'
    import { goto } from '@sapper/app';
    import {linkPrefixes} from '../../navigation/linkPrefixes'
    import type { DeclaringClaimStatus } from '../../interfaces/DeclaringClaimStatus';
import { currentClaimIdStore } from '../../stores/currentClaimIdStore';

    let declaringClaimStatus:DeclaringClaimStatus= "nothing"
    declaringClaimStore.subscribe(declaringClaim => {
        declaringClaimStatus = declaringClaim.declaringClaimStatus
        if (declaringClaimStatus !== "nothing") {
            const claimToDeclare = declaringClaim.claimToDeclare
            if (!claimToDeclare) throw new Error("Claim to declare is undefined.")
            currentClaimIdStore.set(claimToDeclare.id)
            goto(linkPrefixes.claimLinkPrefix+claimToDeclare.id)
        }
    })
</script>
<main class="flex-grow overflow-y-auto flex flex-col items-center justify-center p-1 mx-auto max-w-screen-2xl">
    {#if declaringClaimStatus === "nothing"}
        <NewClaimForm/>
    {/if}   
</main>
