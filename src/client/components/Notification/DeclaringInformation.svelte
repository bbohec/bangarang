<script lang="ts">
    import {declaringClaimUserNotificationStore} from "../../stores/declaringClaimStore"
    import GenericTaskNotification from './GenericTaskNotification.svelte'
</script>
<GenericTaskNotification taskNotification={$declaringClaimUserNotificationStore}/>
