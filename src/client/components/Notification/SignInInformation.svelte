<script lang="ts">
    import {signInStore} from "../../stores/signInStore"
    import GenericTaskNotification from './GenericTaskNotification.svelte'
</script>
<GenericTaskNotification
    runningCondition={$signInStore.signInStatus === "signing in"}
    runningTaskText={"Signing in..."}
    successCondition={$signInStore.signInStatus === "signed in"}
    successTaskText={"Signed in."}
/>
