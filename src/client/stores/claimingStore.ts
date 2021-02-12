import {Writable, writable} from 'svelte/store'
import type { ClaimingContract } from '../interfaces/ClaimingContract'
import { updateClaim } from '../logic/claim/updateClaim';
import { claimed } from '../logic/claiming/claimed';
export const claimingStore:Writable<ClaimingContract> = writable({claimingStatus:"nothing"})
claimingStore.subscribe(claiming => {
    if (claiming.claimingStatus === "claiming") {
        const claimingFakeWaitingTime = 500
        updateClaim(claiming.claimId, claiming.claimChoice);
        setTimeout(() => claimed(), claimingFakeWaitingTime);
    }
});
