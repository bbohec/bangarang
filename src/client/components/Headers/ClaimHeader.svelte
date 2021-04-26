<script lang="ts">
    import { headerCenteredClass } from "../Styles/componentStyles";
    export let title:string
</script>
<header class={headerCenteredClass}>
    <p class=" self-center text-lg text-center text-bangarang-lightEmphasis">{title}</p>
</header>