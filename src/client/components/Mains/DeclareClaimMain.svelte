<script lang="ts">
    import NewClaimForm from '../Form/NewClaimForm.svelte'
    import {declaringClaimUserNotificationStore} from '../../stores/declaringClaimStore'
    import { goto } from '@sapper/app';
    import {linkPrefixes} from '../../navigation/linkPrefixes'
    import type { DeclaringClaimStatus } from '../../interfaces/DeclaringClaimStatus';
    import { currentClaimIdStore } from '../../stores/currentClaimIdStore';
import type { UserNotificationStatus } from '../../port/UserNotification';
    //let declaringClaimStatus:UserNotificationStatus= "Idle"
    /*
    declaringClaimUserNotificationStore.subscribe(declaringClaimUserNotification => {
        declaringClaimStatus = declaringClaimUserNotification.status
        if (declaringClaimStatus !== "Idle" && declaringClaimUserNotification.claimToDeclare) {
            currentClaimIdStore.set(declaringClaimUserNotification.claimToDeclare.id)
            goto(linkPrefixes.claimLinkPrefix+declaringClaimUserNotification.claimToDeclare.id)
        }
    })
    */
</script>
<main class="flex-grow overflow-y-auto flex flex-col items-center justify-center p-1 mx-auto max-w-screen-2xl">
    {#if $declaringClaimUserNotificationStore.status === "Idle"}
        <NewClaimForm/>
    {/if}   
</main>
