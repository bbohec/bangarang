<script lang="ts">
    import Link from "../components/unit/Links/Link.svelte"
    import {links} from "../components/routing/links"
    import ViewTitle from "../components/unit/Titles/ViewTitle.svelte"
    import DescriptionCard from "../components/unit/Cards/DescriptionCard.svelte"
    import type { DescriptionCardContract } from "../components/interfaces/DescriptionCardContract";
    const leanCanvas:Array<{partName:string,sections:Array<DescriptionCardContract>}> = [
        {
            partName:"Customers",
            sections: [
                {
                    title:"Customer Segments",
                    description:"List of target customers and users.",
                    bulletPoints:["Anyone that want to give his opinion about a subject."]
                },
                {
                    title:"Early Adopters",
                    description:"Characteristics list of ideal customers.",
                    bulletPoints:["Syndicates","Activits","Team members where there is lot of control"],
                    links:[
                        {name:"Are your a syndicalist?",href:links.syndicalistEarlyAdopters},
                        {name:"Are your an activist?",href:links.activistEarlyAdopters},
                        {name:"Are your an agile team member?",href:links.agileTeamMemberEarlyAdopters}
                    ]
                }
            ]
        },
        {
            partName:"Problem",
            sections: [
                {
                    title:"",
                    description:"List your customer's top 3 problems",
                    bulletPoints:[
                        "Individuals can't give their opinion anonymously.",
                        "Individuals can't give their opinion for subjects that matters to them.",
                        "Individuals can't pay for giving their opinion.",
                        "Individuals don't want to move for giving their opinion."
                    ]
                }
            ]
        },
        {
            partName:"Unique Value Proposition",
            sections: [
                {
                    title:"",
                    description:"Single, clear, compelling message that states why Bangarang is different and worth paying attention.",
                    bulletPoints:[
                        "Provide people sovereignty.",
                        "Improve human rights: freedom, equality & justice for all.",
                        "Remove power & authority.",
                        "Solution with energy efficiency by design."
                    ]
                }
            ]
        },
        {
            partName:"Solution",
            sections: [
                {
                    title:"",
                    description:"Top features.",
                    bulletPoints:[
                        "Users can interact with Claims.",
                        "User actions are only tracked at the user level.",
                        "Anyone can subscribe.",
                        "Free."
                    ]
                }
            ]
        }
        ,
        {
            partName:"Channels",
            sections: [
                {
                    title:"",
                    description:"Path list to customers.",
                    bulletPoints:[
                        "YouTube - Daily Marketing Videos.",
                        "Responce to daily news.",
                        "Dev/Marketing Transparant Streaming."
                    ]
                }
            ]
        },
        {
            partName:"Revenue Streams",
            sections: [
                {
                    title:"",
                    description:"Sources of revenue list.",
                    bulletPoints:[
                        "++ User Support in exchange of being part of credits",
                        "-- Organisation Support in exchange of being part of credits",
                        "---- Paid features (money give advantage / power)"
                    ]
                }
            ]
        },
        {
            partName:"Cost Structure",
            sections: [
                {
                    title:"",
                    description:"Fixed and variable costs list.",
                    bulletPoints:[
                        "One producter > Me > self financing for 7 months 2 days per week > full time 80k/yr and decreasing.",
                        "Additionnal producters > bonus or maybe free help > not needed on early stage.",
                        "Infrastructure cost > not needed on early stage.",
                        "Organizations financial/political/marketing aggressivity."
                    ]
                }
            ]
        },
        {
            partName:"Key Metrics",
            sections: [
                {
                    title:"",
                    description:"Key activities Bangarang measure.",
                    bulletPoints:[
                        "Daily votes/ballot.",
                        "HOT votes/ballot.",
                        "Organisations that are not supporting us :).",
                        "People not already registered/voting for HOT vote :)."
                    ]
                }
            ]
        },
        {
            partName:"Unfair Advantage",
            sections: [
                {
                    title:"",
                    description:"Can't be easily copied or bought.",
                    bulletPoints:[
                        "Open Source / Transparancy.",
                        "Free of use.",
                        "Not fully skilled but can do it.",
                        "Crazy Dude with crazy ideas :).",
                        "Cost effective.",
                    ]
                }
            ]
        }
    ]
</script>

<header class="flex flex-col">
    <ViewTitle title="Bangarang Lean Canvas"/>
</header>
<main class="flex-grow overflow-y-auto">
    {#each leanCanvas as leanCanvasPart}
        <h1 class="text-xl mt-4 text-bangarang-dark font-semibold text-center">{leanCanvasPart.partName}</h1>
        {#each leanCanvasPart.sections as section}
            <DescriptionCard descriptionCardContract={section}/>
        {/each}
    {/each}
</main>
<footer class="flex flex-col">
    <Link size="small" linkName="The Business Model" linkHref={links.businessModel}/>
    <Link size="small" linkName="Use Bangarang!" linkHref={links.mainMenu}/>
</footer>