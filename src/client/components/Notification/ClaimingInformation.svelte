<script lang="ts">
    import {claimingUserNotificationStore} from "../../stores/claimingStore"
    import GenericTaskNotification from './GenericTaskNotification.svelte'
</script>
<GenericTaskNotification taskNotification={$claimingUserNotificationStore}/>