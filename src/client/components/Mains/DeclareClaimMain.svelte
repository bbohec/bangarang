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
            currentClaimIdStore.set(declaringClaim.claimToDeclare.id)
            goto(linkPrefixes.claimLinkPrefix+declaringClaim.claimToDeclare.id)
        }
    })
</script>
<main class="flex-grow overflow-y-auto flex flex-col items-center justify-center p-1">
    {#if declaringClaimStatus === "nothing"}
        <NewClaimForm/>
    {/if}   
</main>
