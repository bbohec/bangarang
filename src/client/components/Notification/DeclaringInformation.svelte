<script lang="ts">
    import {declaringClaimStore} from "../../stores/declaringClaimStore"
    import GenericTaskNotification from './GenericTaskNotification.svelte'
</script>
<GenericTaskNotification
    runningCondition={$declaringClaimStore.declaringClaimStatus === "declaringClaim"}
    runningTaskText={"Declaring..."}
    successCondition={$declaringClaimStore.declaringClaimStatus === "claimDeclared"}
    successTaskText={"Declared."}
/>
