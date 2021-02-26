<script lang="ts">
    import {claimingStore} from "../../stores/claimingStore"
    import GenericTaskNotification from './GenericTaskNotification.svelte'
</script>
<GenericTaskNotification
    runningCondition={$claimingStore.claimingStatus === "claiming"}
    runningTaskText={"Claiming..."}
    successCondition={$claimingStore.claimingStatus === "claimed"}
    successTaskText={"Claimed."}
/>