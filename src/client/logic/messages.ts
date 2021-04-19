import type { DescriptionCardContract } from "../interfaces/DescriptionCardContract";
import { linkPrefixes } from "../navigation/linkPrefixes";
import { StaticView } from "../port/interactors/BangarangUserInterfaceInteractor";
import type { Language, MessageContract, SelectLanguage } from "./language";
import { Message} from "./language";

import { valuePropositionsDesignCanvas } from "./valueProposition/valuePropositions";
export const welcomeMessage:MessageContract={
    en:"Welcome to",
    fr:"Bienvenue sur"
}
export const bangarang:MessageContract = {
    en:"BANGARANG",
    fr:"BANGARANG"
}
export const leanCanvasTitleMessage:MessageContract = {
    en:`Bangarang Lean Canvas`,
    fr:`Le Lean Canvas de Bangarang`
}
export const bangarangDescriptionMessage:MessageContract = {
    en:"Bangarang is an open source and free direct democratic claim system. It allows anybody to declare or search for claim and claiming for them anonymously.",
    fr:"Bangarang est un systeme de démocratie directe Open Source et gratuit basé sur les revendication. Il permet à chacun de déclarer ou de rechercher une revendication et de revendiquer dessus anonymement."
}
const stage = "pre-alpha"
export const demoWarningMessage:MessageContract= {
    en:`Bangarang is currently on <b>${stage}</b> stage. If you want to be informed about the next stages, you can provide your email on the following Google Form.<br>Thanks.`,
    fr:`Bangarang est actuellement en stage <b>${stage}</b>. Si vous souhaitez être informé à propos des prochaines étapes du développement, vous pouvez transmettre votre email sur le formulaire Google Form suivant.<br>Merci.`
}
export const leanCanvasCustomerPartNameMessage:MessageContract ={
    en:`Customers`,
    fr:`*** TRADUCTION MANQUANTE ***`
}
export const leanCanvasProblemPartNameMessage:MessageContract ={
    en:`Problem`,
    fr:`*** TRADUCTION MANQUANTE ***`
}
export const leanCanvasSolutionPartNameMessage:MessageContract ={
    en:`Solution`,
    fr:`*** TRADUCTION MANQUANTE ***`
}
export const leanCanvasChannelsPartNameMessage:MessageContract ={
    en:`Channels`,
    fr:`*** TRADUCTION MANQUANTE ***`
}
export const leanCanvasRevenueStreamsPartNameMessage:MessageContract ={
    en:`Revenue Streams`,
    fr:`*** TRADUCTION MANQUANTE ***`
}
export const leanCanvasCostStructurePartNameMessage:MessageContract ={
    en:`Cost Structure`,
    fr:`*** TRADUCTION MANQUANTE ***`
}
export const leanCanvasKeyMetricsPartNameMessage:MessageContract ={
    en:`Key Metrics`,
    fr:`*** TRADUCTION MANQUANTE ***`
}
export const leanCanvasUnfairAdvantagePartNameMessage:MessageContract ={
    en:`Unfair Advantage`,
    fr:`*** TRADUCTION MANQUANTE ***`
}
export const leanCanvasUniqueValuePropositionPartNameMessage:MessageContract ={
    en:`Unique Value Proposition`,
    fr:`*** TRADUCTION MANQUANTE ***`
}
export const leanCanvasUnfairAdvantageMessages: {
    title:MessageContract,
    description:MessageContract,
    bulletPoints:MessageContract[],
    linkName?:MessageContract
}= {
    title: {
        en:``,
        fr:`*** TRADUCTION MANQUANTE ***`
    },
    description: {
        en:`Can't be easily copied or bought.`,
        fr:`*** TRADUCTION MANQUANTE ***`
    },
    bulletPoints:[
        {
            en:`Open Source / Transparancy.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`Free of use.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`Not fully skilled but can do it.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`Crazy Dude with crazy ideas 🙃.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`Cost effective.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        }
    ]
}
export const leanCanvasKeyMetricsMessages: {
    title:MessageContract,
    description:MessageContract,
    bulletPoints:MessageContract[],
    linkName?:MessageContract
}= {
    title: {
        en:``,
        fr:`*** TRADUCTION MANQUANTE ***`
    },
    description: {
        en:`Key activities Bangarang measure.`,
        fr:`*** TRADUCTION MANQUANTE ***`
    },
    bulletPoints:[
        {
            en:`Daily votes/ballot.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`HOT votes/ballot.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`Organisations that are not supporting us 🙂.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`People not already registered/voting for HOT vote 🙂.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        }
    ]
}
export const leanCanvasCostStructureMessages: {
    title:MessageContract,
    description:MessageContract,
    bulletPoints:MessageContract[],
    linkName?:MessageContract
}= {
    title: {
        en:``,
        fr:`*** TRADUCTION MANQUANTE ***`
    },
    description: {
        en:`Fixed and variable costs list.`,
        fr:`*** TRADUCTION MANQUANTE ***`
    },
    bulletPoints:[
        {
            en:`One producter > Me > self financing for 7 months 2 days per week > full time 80k/yr and decreasing.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`Additionnal producters > bonus or maybe free help > not needed on early stage.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`Infrastructure cost > not needed on early stage.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`Organizations financial/political/marketing aggressivity.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        }
    ]
}
export const leanCanvasRevenueStreamsMessages: {
    title:MessageContract,
    description:MessageContract,
    bulletPoints:MessageContract[],
    linkName?:MessageContract
}= {
    title: {
        en:``,
        fr:`*** TRADUCTION MANQUANTE ***`
    },
    description: {
        en:`Sources of revenue list.`,
        fr:`*** TRADUCTION MANQUANTE ***`
    },
    bulletPoints:[
        {
            en:`++ User Support in exchange of being part of credits`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`-- Organisation Support in exchange of being part of credits`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`---- Paid features (money give advantage / power)`,
            fr:`*** TRADUCTION MANQUANTE ***`
        }
    ]
}
export const leanCanvasChannelsMessages: {
    title:MessageContract,
    description:MessageContract,
    bulletPoints:MessageContract[],
    linkName?:MessageContract
}= {
    title: {
        en:``,
        fr:`*** TRADUCTION MANQUANTE ***`
    },
    description: {
        en:`Path list to customers.`,
        fr:`*** TRADUCTION MANQUANTE ***`
    },
    bulletPoints:[
        {
            en:`YouTube - Daily Marketing Videos.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`Responce to daily news.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`Dev/Marketing Transparant Streaming.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        }
    ]
}
export const leanCanvasSolutionMessages: {
    title:MessageContract,
    description:MessageContract,
    bulletPoints:MessageContract[],
    linkName?:MessageContract
}= {
    title: {
        en:``,
        fr:`*** TRADUCTION MANQUANTE ***`
    },
    description: {
        en:`Top features.`,
        fr:`*** TRADUCTION MANQUANTE ***`
    },
    bulletPoints:[
        {
            en:`Users can interact with Claims.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`User actions are only tracked at the user level.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`Anyone can subscribe.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`Free.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        }
    ]
}
export const leanCanvasUniqueValuePropositionMessages: {
    title:MessageContract,
    description:MessageContract,
    bulletPoints:MessageContract[],
    linkName?:MessageContract
}= {
    title: {
        en:``,
        fr:`*** TRADUCTION MANQUANTE ***`
    },
    description: {
        en:`Single, clear, compelling message that states why Bangarang is different and worth paying attention.`,
        fr:`*** TRADUCTION MANQUANTE ***`
    },
    bulletPoints:[
        {
            en:`Provide people sovereignty.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`Improve human rights: freedom, equality & justice for all.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`Remove power & authority.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`Solution with energy efficiency by design.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        }
    ]
}
export const leanCanvasProblemMessages: {
    title:MessageContract,
    description:MessageContract,
    bulletPoints:MessageContract[],
    linkName?:MessageContract
}= {
    title: {
        en:``,
        fr:`*** TRADUCTION MANQUANTE ***`
    },
    description: {
        en:`List your customer's top 3 problems.`,
        fr:`*** TRADUCTION MANQUANTE ***`
    },
    bulletPoints:[
        {
            en:`Individuals can't give their opinion anonymously.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`Individuals can't give their opinion for subjects that matters to them.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`Individuals can't pay for giving their opinion.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`Individuals don't want to move for giving their opinion.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        }
    ]
}
export const leanCanvasCustomerEarlyAdoptersMessages: {
    title:MessageContract,
    description:MessageContract,
    bulletPoints:MessageContract[],
    linkName?:MessageContract
}= {
    title: {
        en:`Early Adopters`,
        fr:`*** TRADUCTION MANQUANTE ***`
    },
    description: {
        en:`Characteristics list of ideal customers.`,
        fr:`*** TRADUCTION MANQUANTE ***`
    },
    bulletPoints:[
        {
            en:`Syndicates`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`Activits`,
            fr:`*** TRADUCTION MANQUANTE ***`
        },
        {
            en:`Team members where there is lot of control`,
            fr:`*** TRADUCTION MANQUANTE ***`
        }
    ]
}
export const leanCanvasCustomerSegmentsMessages: {
    title:MessageContract,
    description:MessageContract,
    bulletPoints:MessageContract[],
    links?:MessageContract[]
}= {
    title: {
        en:`Customer Segments`,
        fr:`*** TRADUCTION MANQUANTE ***`
    },
    description: {
        en:`List of target customers and users.`,
        fr:`*** TRADUCTION MANQUANTE ***`
    },
    bulletPoints:[
        {
            en:`Anyone that want to give his opinion about a subject.`,
            fr:`*** TRADUCTION MANQUANTE ***`
        }
    ]
}
export const whatIsBangarangMessages: {
    title:MessageContract,
    description:MessageContract,
    bulletPoints:MessageContract[]
}= {
    title: {
        en:"What is Bangarang?",
        fr:`C'est quoi Bangarang?`
    },
    description: {
        en:`Bangarang is an open source and free democratic claim system that allow anybody to:`,
        fr:`Bangarang est système Open Source et gratuit de démocratie directe à base de revendications permettant à chacun de:`
    },
    bulletPoints:[
        {
            en:`create a claim`,
            fr:`créer une revendication`
        },
        {
            en:`search for claims`,
            fr:`rechercher une revendication`
        },
        {
            en:`claiming anonymously`,
            fr:`revendiquer anonymement`
        }
    ]
}
export const definitionOfBangarangMessages: {
    title:MessageContract,
    description:MessageContract,
    bulletPoints:MessageContract[]
}= {
    title: {
        en:"Definition of Bangarang",
        fr:`Définition de Bangarang`
    },
    description: {
        en:`According to Urban Dictionary:`,
        fr:`D'après Urban Dictionary:`
    },
    bulletPoints:[
        {
            en:`Battle cry of the Lost Boys in the movie Hook.`,
            fr:`Cri de bataille des Enfants Perdus dans le film Hook.`
        },
        {
            en:`Jamaican slang defined as a hubbub, uproar, disorder, or disturbance.`,
            fr:`Argot jamaïcain définissant un brouhaha, un tollé, un désordre ou une perturbation.`
        },
        {
            en:`General exclamation meant to signify approval or amazement.`,
            fr:`Exclamation générale destinée à signifier l'approbation ou la stupéfaction.`
        }
    ]
}
export const whyThisNameMessages: {
    title:MessageContract,
    description:MessageContract,
    bulletPoints:MessageContract[]
}= {
    title: {
        en:`Why this name?`,
        fr:`Pourquoi ce nom?`
    },
    description: {
        en:``,
        fr:`*** TRADUCTION MANQUANTE ***`
    },
    bulletPoints:[
        {
            en:`Individuals act like Lost Boys. They are a family within each other. They also have strong spiritual and social beliefs. Furthermore, they are hard workers and want to help not only themselves but the others.`,
            fr:`Les individus agissent comme des Enfants Perdus. Ils sont une famille. Ils ont de fortes croyances spirituelles et sociales. De plus, ils travailent beaucoup et veulent aussi bien s'aider aux même que les autres.`
        },
        {
            en:`Organizations and leaders act like Pirates. They are looking for power and profit. They also have strong growth and control main beliefs. Not only that, but they are delegating work and want to help themselves and their partners.`,
            fr:`Les organisations et les leaders agissent comme des Pirates. Ils sont à la recherche de pouvoir et de profit. Ils ont des croyances fortes pour la croissance et le control. De plus, ils délèguent le travail et veulent s'aider entre eux ainsi que leurs partenaires.`
        },
        {
            en:`Bangarang act as a disturbance of current systems by providing lead to individuals. But individuals must not have more lead each other.`,
            fr:`Bangarang agit comme une perturbation pour les systèmes actuels en fournissant plus de pouvoir pour chaque individus. Mais chaque individus ne dois pas avoir plus de pouvoir qu'un autre.`
        },
        {
            en:`By providing lead to individuals and guarantee this lead with equality, this should provide global amazement and systemic breakthrough`,
            fr:`En redonnant du pouvoir à chaque individu et en garantissant un pouvoir équitable, cela pourra fournir une révolution systémique et une stimulation des individus pour le bien commun.`
        }
    ]
}
export const useBangarangLinkMessage:MessageContract={
    en:"Use Bangarang!",
    fr:"Revendiquez sur Bangarang!"
}

export const leanCanvasLinkMessage:MessageContract={
    en:"The Lean Canvas",
    fr:"Le Lean Canvas"
}
export const bangarangContactFormMessage:MessageContract={
    en:`Bangarang contact form.`,
    fr:`Formulaire de contact Bangarang.`
}
export const declareClaimTextButtonMessage:MessageContract = {
    en:`Declare new claim`,
    fr:`Déclarer une nouvelle revendication`
}
export const bangarangBusinessModelTitleMessage:MessageContract = {
    en:`Bangarang Business Model`,
    fr:`Le Business Model de Bangarang`
}
export const faqLinkNameMessage:MessageContract={
    en:`What is Bangarang?`,
    fr:`C'est quoi Bangarang?`
}
export const claimSearchBarPlaceholderMessage:MessageContract={
    en:`Find a claim...`,
    fr:"Chercher une revendication..."
}
export const backToMainMenuLinkMessage:MessageContract={
    en:`Back to main menu.`,
    fr:`Retour au menu principal.`
}
export const selectLanguages:SelectLanguage = {
    en:{
        languageText:"English",
        selectYourLanguageMessage:"Select your language.",
        linkToMainMenuWithLanguage:`en/${StaticView.MainMenu}`
    },
    fr:{
        languageText:"Français",
        selectYourLanguageMessage:"Veuillez selectionner votre langue.",
        linkToMainMenuWithLanguage:`fr/${StaticView.MainMenu}`
    }
}
export const leanCanvas=(language:Language):Array<{partName:string,sections:Array<DescriptionCardContract>}> => ([
    {
        partName:new Message(leanCanvasCustomerPartNameMessage).getMessage(language),
        sections: [
            {
                title:new Message(leanCanvasCustomerSegmentsMessages.title).getMessage(language),
                description:new Message(leanCanvasCustomerSegmentsMessages.description).getMessage(language),
                bulletPoints:leanCanvasCustomerSegmentsMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage(language))
            },
            {
                title:new Message(leanCanvasCustomerEarlyAdoptersMessages.title).getMessage(language),
                description:new Message(leanCanvasCustomerEarlyAdoptersMessages.description).getMessage(language),
                bulletPoints:leanCanvasCustomerEarlyAdoptersMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage(language)),
                links:valuePropositionsDesignCanvas.map(valuePropositionDesignCanvas => ({
                    name:new Message(valuePropositionDesignCanvas.linkName).getMessage(language),
                    href:`/${language}/${linkPrefixes.valuePropositionLinkPrefix}${valuePropositionDesignCanvas.pageLink}`
                }))
            }
        ]
    },
    {
        partName:new Message(leanCanvasProblemPartNameMessage).getMessage(language),
        sections: [
            {
                title:new Message(leanCanvasProblemMessages.title).getMessage(language),
                description:new Message(leanCanvasProblemMessages.description).getMessage(language),
                bulletPoints:leanCanvasProblemMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage(language))
            }
        ]
    },
    {
        partName:new Message(leanCanvasUniqueValuePropositionPartNameMessage).getMessage(language),
        sections: [
            {
                title:new Message(leanCanvasUniqueValuePropositionMessages.title).getMessage(language),
                description:new Message(leanCanvasUniqueValuePropositionMessages.description).getMessage(language),
                bulletPoints:leanCanvasUniqueValuePropositionMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage(language))
            }
        ]
    },
    {
        partName:new Message(leanCanvasSolutionPartNameMessage).getMessage(language),
        sections: [
            {
                title:new Message(leanCanvasSolutionMessages.title).getMessage(language),
                description:new Message(leanCanvasSolutionMessages.description).getMessage(language),
                bulletPoints:leanCanvasSolutionMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage(language))
            }
        ]
    }
    ,
    {
        partName:new Message(leanCanvasChannelsPartNameMessage).getMessage(language),
        sections: [
            {
                title:new Message(leanCanvasChannelsMessages.title).getMessage(language),
                description:new Message(leanCanvasChannelsMessages.description).getMessage(language),
                bulletPoints:leanCanvasChannelsMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage(language))
            }
        ]
    },
    {
        partName:new Message(leanCanvasRevenueStreamsPartNameMessage).getMessage(language),
        sections: [
            {
                title:new Message(leanCanvasRevenueStreamsMessages.title).getMessage(language),
                description:new Message(leanCanvasRevenueStreamsMessages.description).getMessage(language),
                bulletPoints:leanCanvasRevenueStreamsMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage(language))
            }
        ]
    },
    {
        partName:new Message(leanCanvasCostStructurePartNameMessage).getMessage(language),
        sections: [
            {
                title:new Message(leanCanvasCostStructureMessages.title).getMessage(language),
                description:new Message(leanCanvasCostStructureMessages.description).getMessage(language),
                bulletPoints:leanCanvasCostStructureMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage(language))
            }
        ]
    },
    {
        partName:new Message(leanCanvasKeyMetricsPartNameMessage).getMessage(language),
        sections: [
            {
                title:new Message(leanCanvasKeyMetricsMessages.title).getMessage(language),
                description:new Message(leanCanvasKeyMetricsMessages.description).getMessage(language),
                bulletPoints:leanCanvasKeyMetricsMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage(language))
            }
        ]
    },
    {
        partName:new Message(leanCanvasUnfairAdvantagePartNameMessage).getMessage(language),
        sections: [
            {
                title:new Message(leanCanvasUnfairAdvantageMessages.title).getMessage(language),
                description:new Message(leanCanvasUnfairAdvantageMessages.description).getMessage(language),
                bulletPoints:leanCanvasUnfairAdvantageMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage(language))
            }
        ]
    }
])
export const retrieveSubTitleFromType = (type:string):MessageContract => {
    if (type === 'customerJobs')return {en:`You have activities`,fr:`*** TRADUCTION MANQUANTE ***`}
    if (type === 'pains')return {en:`But you have pains`,fr:`*** TRADUCTION MANQUANTE ***`}
    if (type === 'painRelievers')return {en:`We want to help you`,fr:`*** TRADUCTION MANQUANTE ***`}
    if (type === 'productAndServices')return {en:`We have a solution`,fr:`*** TRADUCTION MANQUANTE ***`}
    if (type === 'gainCreators')return {en:`We provide additionnal capabilities`,fr:`*** TRADUCTION MANQUANTE ***`}
    if (type === 'gains')return {en:`You can acheive more`,fr:`*** TRADUCTION MANQUANTE ***`}
    return {en:`!!!ERROR UNKNOWN TYPE!!!`,fr:`*** TRADUCTION MANQUANTE ***`}
}

export const callToActionMessage:MessageContract={
    en:`Get started`,
    fr:`*** TRADUCTION MANQUANTE ***`
}