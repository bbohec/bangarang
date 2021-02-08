<script lang="ts">
    import {Router,Route} from "svelte-routing"
    import {links,claimLinkPrefix} from "./links"
    import MainMenu from "../pages/MainMenu.svelte"
    import BusinessModel from "../pages/BusinessModel.svelte"
    import LeanCanvas from "../pages/LeanCanvas.svelte"
    import ValuePropositionModel from "../pages/ValuePropositionModel.svelte"
    import LandingPageModel from "../pages/LandingPageModel.svelte"
    import {valuePropositionsDesignCanvas} from "../logic/valuePropositions"
    import ClaimModel from "../pages/ClaimModel.svelte"
</script>
<Router url={"/claims/claim1"}>
    <Route path={links.mainMenu}><MainMenu/></Route>
    <Route path={links.businessModel}><BusinessModel/></Route>
    <Route path={links.leanCanvas}><LeanCanvas/></Route>
    {#each valuePropositionsDesignCanvas as valuePropositionDesignCanvas}
        {#each valuePropositionDesignCanvas.pains as pain,index }
            <Route path={`${valuePropositionDesignCanvas.audience}Landing${index}`}><LandingPageModel mainHeadLine={pain} supportingHeadline={valuePropositionDesignCanvas.painRelievers[index]} /></Route>
        {/each}  
    {/each}
    {#each valuePropositionsDesignCanvas as valuePropositionDesignCanvas}
        <Route path={valuePropositionDesignCanvas.pageLink}><ValuePropositionModel valuePropositionDesignCanvas={valuePropositionDesignCanvas}/></Route>
    {/each}
    <Route path="{claimLinkPrefix}:id" let:params>
        <ClaimModel id="{params.id}"/>
    </Route>
    <Route path={"/"}><MainMenu/></Route>
</Router>