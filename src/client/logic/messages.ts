import type { DescriptionCardContract } from "../interfaces/DescriptionCardContract";
import { linkPrefixes, StaticView } from "../port/interactors/BangarangUserInterfaceInteractor";
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
    fr:`Audiences`
}
export const leanCanvasProblemPartNameMessage:MessageContract ={
    en:`Problem`,
    fr:`Problème`
}
export const leanCanvasSolutionPartNameMessage:MessageContract ={
    en:`Solution`,
    fr:`Solution`
}
export const leanCanvasChannelsPartNameMessage:MessageContract ={
    en:`Channels`,
    fr:`Cannaux`
}
export const leanCanvasRevenueStreamsPartNameMessage:MessageContract ={
    en:`Revenue Streams`,
    fr:`Sources de Revenus`
}
export const leanCanvasCostStructurePartNameMessage:MessageContract ={
    en:`Cost Structure`,
    fr:`Structure de Coût`
}
export const leanCanvasKeyMetricsPartNameMessage:MessageContract ={
    en:`Key Metrics`,
    fr:`Indicateurs clés`
}
export const leanCanvasUnfairAdvantagePartNameMessage:MessageContract ={
    en:`Unfair Advantage`,
    fr:`Avantage Compétitif`
}
export const leanCanvasUniqueValuePropositionPartNameMessage:MessageContract ={
    en:`Unique Value Proposition`,
    fr:`Proposition de Valeur Unique`
}
export const leanCanvasUnfairAdvantageMessages: {
    title:MessageContract,
    description:MessageContract,
    bulletPoints:MessageContract[],
    linkName?:MessageContract
}= {
    title: {
        en:``,
        fr:``
    },
    description: {
        en:`Can't be easily copied or bought.`,
        fr:`Ce qui ne peut pas être copié ou achetté ailleurs.`
    },
    bulletPoints:[
        {
            en:`Open Source / Transparancy.`,
            fr:`Open Source / Transparence.`
        },
        {
            en:`Free of use.`,
            fr:`Gratuit à l'usage.`
        },
        {
            en:`Not fully skilled but can do it 🙂.`,
            fr:`Pas compétent sur tout mais on s'éxécute 🙂.`
        },
        {
            en:`Crazy Dude with crazy ideas 🙃.`,
            fr:`Contributeur fou avec des idées folles 🙃.`
        },
        {
            en:`Cost effective.`,
            fr:`Faibles coûts.`
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
        fr:``
    },
    description: {
        en:`Key activities Bangarang measure.`,
        fr:`Les indicateurs clés de Bangarang.`
    },
    bulletPoints:[
        {
            en:`Quantity of claims.`,
            fr:`Nombre de revendications / acte de revendiquer.`
        },
        {
            en:`HOT claims of the day.`,
            fr:`Les revendications chaudes du moment.`
        },
        {
            en:`Organisations that are not supporting us 🙂.`,
            fr:`Organisations qui ne nous supportent pas 🙂.`
        },
        {
            en:`People not already registered/voting for HOT vote 🙂.`,
            fr:`Personnes qui ne sont pas encore enregistrées ou qui n'ont pas encore votées sur les votes chauds 🙂.`
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
        fr:``
    },
    description: {
        en:`Fixed and variable costs list.`,
        fr:`Centres de cout fixes et variables.`
    },
    bulletPoints:[
        {
            en:`One producter > Me > self financing for 7 months 2 days per week > full time 80k/yr and decreasing.`,
            fr:`Un contributeur de Bangarang > moi > auto financement pendant 7 mois sur 2 jours par semaines > temps plein 80k/an et prévu en baisse.`
        },
        {
            en:`Additionnal producters > bonus or maybe free help > not needed on early stage.`,
            fr:`Contributeurs additionnels > bonus ou peut être pour de l'aide bénévole > pas nécéssaire en premier lieu.`
        },
        {
            en:`Infrastructure cost > not needed on early stage.`,
            fr:`Couts d'infrastructure > pas nécéssaire ou minime en premier lieu`
        },
        {
            en:`Organizations financial/political/marketing aggressivity.`,
            fr:`Aggréssivité financières/politiques/marketing de certaines organisations.`
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
        fr:``
    },
    description: {
        en:`Sources of revenue list.`,
        fr:`Liste des sources de financement.`
    },
    bulletPoints:[
        {
            en:`👍👍 User Support in exchange of being part of credits / goodies.`,
            fr:`👍👍 Support des utilisateurs en échange de faire partie des crédits / goodies.`
        },
        {
            en:`👎👎 Organisation Support in exchange of being part of credits`,
            fr:`👎👎 Support des organisations en échange de faire partie des crédits / sponsors.`
        },
        {
            en:`👎👎👎👎 Paid features (money give advantage / power)`,
            fr:`👎👎👎👎 Fonctionnalités payantes (l'argent apporte des avantages / du pouvoir)`
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
        fr:``
    },
    description: {
        en:`Path list to customers.`,
        fr:`Comment informer les utilisateurs au sujet de Bangarang?`
    },
    bulletPoints:[
        {
            en:`YouTube - Daily Marketing Videos.`,
            fr:`YouTube - Vidéos Marketing Journalières.`
        },
        {
            en:`Responce to daily news.`,
            fr:`Revendications basées sur l'actualité journalière.`
        },
        {
            en:`Dev/Marketing Transparant Streaming.`,
            fr:`Streaming transparant sur les actions de développement et de marketing.`
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
        fr:``
    },
    description: {
        en:`Top features.`,
        fr:`Les fonctionnalités importantes.`
    },
    bulletPoints:[
        {
            en:`Users can interact with Claims.`,
            fr:`Les utilisateurs peuvent intéragir avec l'ensemble des revendications.`
        },
        {
            en:`User actions are only tracked at the user level.`,
            fr:`Les actions de chaque utilisateur ne sont suivies qu'au niveau de l'utilisateur lui-même.`
        },
        {
            en:`Anyone can subscribe.`,
            fr:`Tout le monde peut s'inscrire.`
        },
        {
            en:`Bangarang is free.`,
            fr:`Bangarang est gratuit.`
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
        fr:``
    },
    description: {
        en:`Single, clear, compelling message that states why Bangarang is different and worth paying attention.`,
        fr:`Message unique, clair et convaincant qui explique pourquoi Bangarang est différent et mérite une attention particulière.`
    },
    bulletPoints:[
        {
            en:`Provide people sovereignty.`,
            fr:`Rendre le peuple souverain.`
        },
        {
            en:`Improve human rights: freedom, equality & justice for all.`,
            fr:`Améliorer les droits de l'homme: liberté, égalité et justice pour tous.`
        },
        {
            en:`Remove power & authority.`,
            fr:`Réduire les abus de pouvoir et d'autorité.`
        },
        {
            en:`Solution with energy efficiency by design.`,
            fr:`Solution optimale énergiquement de par sa conception.`
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
        fr:``
    },
    description: {
        en:`List your customer's top 3 problems.`,
        fr:`Liste des 3 principaux problèmes des utilisateurs.`
    },
    bulletPoints:[
        {
            en:`Individuals can't give their opinion anonymously.`,
            fr:`Les individus ne peuvent pas donner leurs opinions annonymement.`
        },
        {
            en:`Individuals can't give their opinion for subjects that matters to them.`,
            fr:`Les individus ne peuvent pas donner leurs opinnions sur des sujets qui font sens pour eux.`
        },
        {
            en:`Individuals can't pay for giving their opinion.`,
            fr:`Les individus ne peuvent pas payer pour donner leurs opinions.`
        },
        {
            en:`Individuals don't want to move for giving their opinion.`,
            fr:`Les individues ne veulent pas se déplacer pour donner leurs opinions.`
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
        fr:`Premières audiences`
    },
    description: {
        en:`Characteristics list of ideal customers.`,
        fr:`Les caractéristiques de notre utilisateur idéal.`
    },
    bulletPoints:[
        {
            en:`Syndicates`,
            fr:`Syndicats`
        },
        {
            en:`Activits`,
            fr:`Activistes`
        },
        {
            en:`Team members where there is lot of control`,
            fr:`Membres d'équipe agile`
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
        fr:`Audiences`
    },
    description: {
        en:`List of target customers and users.`,
        fr:`Liste des principaux groupes et utilisateurs cibles`
    },
    bulletPoints:[
        {
            en:`Anyone that want to give his opinion about a subject.`,
            fr:`Toute personne qui souhaite donner son opinion à propos d'un sujet.`
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
        fr:``
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
    en:`Declare claim`,
    fr:`Déclarer une revendication`
}
export const bangarangBusinessModelTitleMessage:MessageContract = {
    en:`Bangarang Business Model`,
    fr:`Le Business Model de Bangarang`
}
export const faqLinkNameMessage:MessageContract={
    en:`FAQ`,
    fr:`Questions fréquentes`
}
export const claimSearchBarPlaceholderMessage:MessageContract={
    en:`Find ...`,
    fr:"Rechercher ..."
}
export const backToMainMenuLinkMessage:MessageContract={
    en:`Main menu`,
    fr:`Menu principal`
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
    if (type === 'customerJobs')return {en:`You have activities`,fr:`Tu fais des actions au quotidien`}
    if (type === 'pains')return {en:`But you have pains`,fr:`Mais tu rencontres des douleurs`}
    if (type === 'painRelievers')return {en:`We want to help you`,fr:`Nous voulons t'aider`}
    if (type === 'productAndServices')return {en:`We have a solution`,fr:`Nous avons une solution`}
    if (type === 'gainCreators')return {en:`We provide additionnal capabilities`,fr:`Nous apportons encore plus`}
    if (type === 'gains')return {en:`You can acheive more`,fr:`Tu pourras ainsi aller au delà`}
    return {en:`!!!ERROR UNKNOWN TYPE!!!`,fr:`!!!ERREUR TYPE INCONU!!!`}
}
export const callToActionMessage:MessageContract={
    en:`Claim`,
    fr:`Revendiquer`
}
export const claimTypeMessage:MessageContract={
    en:`Claim type:`,
    fr:`Type de revendication:`
}
export const claimTitlePlaceholderMessage:MessageContract={
    en:`Describe the claim ...`,
    fr:`Décris la revendication...`
}
export const claimTitleFieldNameMessage:MessageContract={
    en:`Claim title:`,
    fr:`Titre de la revendication:`
}
export const declareClaimSubmitMessage:MessageContract={
    en:`Declare`,
    fr:`Déclarer`
}
export const simpleClaimTypeMessage:MessageContract={
    en:`Claim as a proposal.`,
    fr:`Revendication considérée comme unique proposition.`
}
export const signOutMessage:MessageContract={
    en:`SignOut`,
    fr:`Déconnexion`
}
export const signInFormTitleMessage:MessageContract={
    en:`Your account credentials`,
    fr:`Tes identifiants`
}
export const signInFormUsernameMessage:MessageContract={
    en:`Username:`,
    fr:`Nom du compte:`
}
export const signInFormPasswordMessage:MessageContract={
    en:`Password:`,
    fr:`Mot de passe:`
}
export const signInFormSubmitMessage:MessageContract={
    en:`Sign In`,
    fr:`Connexion`
}
export const signInRegisterMessage:MessageContract={
    en:`Register`,
    fr:`S'enregister`
}
export const backToTheClaimMessage:MessageContract={
    en:`Claim`,
    fr:`Revendication`
}
export const backToSignInMenuMessage:MessageContract={
    en:`Sign In`,
    fr:`Connexion`
}
export const registerOnBangarangTitleMessage:MessageContract={
    en:`Register on`,
    fr:`Enregistres-toi sur`
}
export const registerSecurityMessage:MessageContract={
    en:`The current stage of development of Bangarang implies that the security of the accounts is not guaranteed. Please only create accounts with credentials that can be used for testing and demonstration purposes.`,
    fr:`Le stage actuel de développement de Bangarang implique que la sécurité des comptes n'est pas garantie. Ne crées un compte qu'avec des identifiants qui peuvent être utilisées à des fins de test ou de démo.`
}
export const registerFormTitleMessage:MessageContract={
    en:`Create your account.`,
    fr:`Crées ton compte.`
}
export const registerFormUsernameMessage:MessageContract={
    en:`Username:`,
    fr:`Nom d'utilisateur:`
}
export const registerFormFullnameMessage:MessageContract={
    en:`Fullname:`,
    fr:`Nom/Prénom:`
}
export const registerFormEmailMessage:MessageContract={
    en:`E-mail:`,
    fr:`E-mail:`
}
export const registerFormPasswordMessage:MessageContract={
    en:`Password:`,
    fr:`Mot de passe:`
}
export const registerFormSubmitMessage:MessageContract={
    en:`Register`,
    fr:`S'inscrire`
}
export const peopleClaimedMessage:MessageContract={
    en:`people claimed`,
    fr:`personnes ont revendiqués`
}
export const claimAgainstMessage:MessageContract={
    en:`Against`,
    fr:`Contre`
}
export const claimForMessage:MessageContract={
    en:`For`,
    fr:`Pour`
}
export const shareClaimMessage:MessageContract={
    en:`Share claim`,
    fr:`Partager la revendication`
}
export const claimCopiedSuccessMessage:MessageContract={
    en:`Claim address copied to clipboard.`,
    fr:`Lien de partage de la revendication copié dans le presse-papier.`
}
export const claimCopiedErrorMessage:MessageContract={
    en:`Failed to copy claim address to clipboard`,
    fr:`Erreur lors de la copie de la revendication dans le presse-papier`
}
export const declareClaimHeaderMessage:MessageContract={
    en:`Declare claim`,
    fr:`Déclarer une revendication`
}


