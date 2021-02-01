<script lang="ts">
    import {Router,Route} from "svelte-routing"
    import {links} from "./links"
    import MainMenu from "../pages/MainMenu.svelte"
    import BusinessModel from "../pages/BusinessModel.svelte"
    import LeanCanvas from "../pages/LeanCanvas.svelte"
    import EarlyAdoptersActivist from "../pages/EarlyAdoptersActivist.svelte"
    import EarlyAdoptersSyndicalist from "../pages/EarlyAdoptersSyndicalist.svelte"
    import EarlyAdoptersAgileTeamMember from "../pages/EarlyAdoptersAgileTeamMember.svelte"
</script>
<Router url={links.mainMenu}>
    <Route path={links.mainMenu}><MainMenu/></Route>
    <Route path={links.businessModel}><BusinessModel/></Route>
    <Route path={links.leanCanvas}><LeanCanvas/></Route>
    <Route path={links.activistEarlyAdopters}><EarlyAdoptersActivist/></Route>
    <Route path={links.syndicalistEarlyAdopters}><EarlyAdoptersSyndicalist/></Route>
    <Route path={links.agileTeamMemberEarlyAdopters}><EarlyAdoptersAgileTeamMember/></Route>
</Router>