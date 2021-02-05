<script lang="ts">
    import {Router,Route} from "svelte-routing"
    import {links} from "./links"
    import MainMenu from "../pages/MainMenu.svelte"
    import BusinessModel from "../pages/BusinessModel.svelte"
    import LeanCanvas from "../pages/LeanCanvas.svelte"
    import ValuePropositionModel from "../pages/ValuePropositionModel.svelte"
    import LandingPageModel from "../pages/LandingPageModel.svelte"
    import {valuePropositionsDesignCanvas} from "../logic/valuePropositions"
</script>
<Router url={"/"}>
    <Route path={"/"}><MainMenu/></Route>
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
</Router>