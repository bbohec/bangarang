import type { ValuePropositionDesignCanvasContract } from "../../interfaces/ValuePropositionCanvasContract";
import { Language, Message } from "../language";
export const valuePropositionsDesignCanvas:ValuePropositionDesignCanvasContract[]= [
    {
        title:{
            en:"Activist Value Proposition",
            fr:`Proposition de Valeur des Activistes`
        },
        audience:{
            en:"Activist",
            fr:`Activiste`
        },
        customerJobs:[
            {
                en:"You revendicate your ideas.",
                fr:`Tu revendiques tes idées.`
            },
            {
                en:"You collectively commit to a cause.",
                fr:`Tu t'engages collectivement pour une cause.`
            },
            {
                en:"Your are pacifist.",
                fr:`Tu es pacifiste.`
            }
        ],
        pains:[
            {
                en:"You suffer too much violence during protest.",
                fr:`Tu subis trop de violences quand tu manifestes.`
            },
            {
                en:"You have to be disobedient.",
                fr:`Tu es obligé de faire de la désobéissance.`
            },
            {
                en:"You die or you are hurt while you protest.",
                fr:`Tu meurts ou tu es blessé lorsque du manifestes.`
            }
        ],
        painRelievers:[
            {
                en:"You will claim from anyware.",
                fr:`Est-ce qu'on va venir t'aggresser chez toi parceque tu as revendiqué sur Bangarang?`
            },
            {
                en:"Does claiming from home is a disobedience?",
                fr:`Est-ce que revendiquer depuis chez toi c'est de la désobéissance?`
            },
            {
                en:"You will not claim by protesting anymore.",
                fr:`Tu n'as plus besoin de manifester pour revendiquer.`
            }
        ],
        productAndServices:[
            {
                en:"Bangarang is an open source and free direct democratic claim system. It allows anybody to declare or search for claim and claiming for them anonymously.",
                fr:`Bangarang est système Open Source et gratuit de démocratie directe à base de revendications permettant à chacun de déclarer ou rechercher une revendication et de revendiquer anonymement.`
            }
        ],
        gainCreators:[
            {
                en:"You can claim whatever you want.",
                fr:`Tu peux revendiquer où tu veux.`
            },
            {
                en:"You can change your mind.",
                fr:`Tu peux changer d'avis.`
            },
            {
                en:"You have as much power as the others.",
                fr:`Tu as autant de pouvoir que les autres.`
            }
        ],
        gains:[
            {
                en:"You can claim on what makes sense to you.",
                fr:`Tu peux revendiquer sur les sujets qui font sens pour toi.`
            },
            {
                en:"You have the right like everyone else to make mistakes.",
                fr:`Tu as le droit de faire des erreurs comme tout le monde et donc tu dois pouvoir changer d'avis.`
            },
            {
                en:"You do direct democracy.",
                fr:`Tu fais de la démocratie directe. Tu décides comme tout le monde.`
            }
        ],
        linkName:{
            en:"Are you an activist?",
            fr:`Es-tu un activiste?`
        },
        pageLink:"activist"
    },
    {
        title:{
            en:"Syndicalist Value Proposition",
            fr:`Proposition de Valeur pour les Syndicalistes`
        },
        audience:{
            en:"Syndicalist",
            fr:`Syndicaliste`
        },
        customerJobs:[
            {
                en:"You defend your interests as a worker.",
                fr:`Tu défends tes intérets en tant que travailleur.`
            },
            {
                en:"You show solidarity with your colleagues.",
                fr:`Tu es solidaire avec tes collègues.`
            },
            {
                en:"You struggle daily for immediate improvements in work but also for the disappearance of salaried workers and employers.",
                fr:`Tu agis tout les jours pour l'amélioration de tes conditions de travail mais aussi contre les inégalités entre les salariés et les employeurs.`
            }
        ],
        pains:[
            {
                en:"You are often divided.",
                fr:`Tu es souvent divisé.`
            },
            {
                en:"You are individualist.",
                fr:`Chaque organisation syndicale est très souvent individualiste.`
            },
            {
                en:"You die at work.",
                fr:`Tu meurs encore au travail.`
            }
        ],
        painRelievers:[
            {
                en:"You will claim on common causes.",
                fr:`Tu vas revendiquer sur des causes communes.`
            },
            {
                en:"You will be free to claim without being unionized.",
                fr:`Tu seras libre de revendiquer quand être forcément avoir les mêmes avis uniques.`
            },
            {
                en:"We will make a strong claim on workplace safety.",
                fr:`Tu pourras revendiquer sur la sécurité au travail.`
            }
        ],
        productAndServices:[
            {
                en:"Bangarang is an open source and free direct democratic claim system. It allows anybody to declare or search for claim and claiming for them anonymously.",
                fr:`Bangarang est système Open Source et gratuit de démocratie directe à base de revendications permettant à chacun de déclarer ou rechercher une revendication et de revendiquer anonymement.`
            }
        ],
        gainCreators:[
            {
                en:"You are unified by the number but independent by your choices.",
                fr:`Tu es unis par le nombre mais tu reste indépendant sur tes propres choix.`
            },
            {
                en:"You can change your mind.",
                fr:`Tu peux changer d'avis.`
            },
            {
                en:"You can claim as much as your employer.",
                fr:`Tu peux revendiquer autant que ton employeur.`
            }
        ],
        gains:[
            {
                en:"You and your colleagues will be more united.",
                fr:`Toi et tes collègues, vous serez plus unis.`
            },
            {
                en:"You have the right like everyone else to make mistakes.",
                fr:`Tu as le droits comme tout le monde de faire des erreures.`
            },
            {
                en:"You greatly reduce the disparities between employers and employees.",
                fr:`Tu peux réduire drastiquement les disparités entre les salariés et les employeurs.`
            }
        ],
        linkName:{
            en:"Are you a syndicalist?",
            fr:`Es-tu syndicaliste?`
        },
        pageLink:"syndicalist"
    },
    {
        title:{
            en:"Agile Team Member Value Proposition",
            fr:`Proposition de Valeur des Equipes Agiles`
        },
        audience:{
            en:"Agile Team Member",
            fr:`Membre d'Equipe Agile`
        },
        customerJobs:[
            {
                en:"Tu are uncovering better ways of developing software by doing it and helping others do it.",
                fr:`Tu découvres comment mieux développer des logiciels par la pratique et en aidant les autres à le faire.`
            }
        ],
        pains:[
            {
                en:"You have more process and tools instead of individuals and interactions.",
                fr:`Tu dois focus plus sur les processus et d'outils que les individus et des intéractions entre eux.`
            },
            {
                en:"You have focus documentation instead of working software.",
                fr:`Tu dois focus la documentation au lieu de créer du logiciel opérationnel.`
            },
            {
                en:"You take lot of time on contract negotiation over customer collaboration.",
                fr:`Tu passes beaucoup de temps sur la négociation contractuelle au lieu de collaborer avec les parties prennantes.`
            },
            {
                en:"You have to follow THE PLAN instead of responding to change.",
                fr:`Tu dois suivre LE PLAN au lieu de t'adapter au changement.`
            }
        ],
        painRelievers:[
            {
                en:"You claim how the software should be.",
                fr:`Tu revendiques comment le logiciel doit être.`
            },
            {
                en:"You claim the rule that documentation is optionnal but working software is mandatory.",
                fr:`Tu revendiques comme règle d'équipe qu'une documentation est optionnelle mais qu'un logiciel fonctionnel est indispensable.`
            },
            {
                en:"You claim NO ESTIMATE.",
                fr:`Tu revendiques le NO ESTIMATE.`
            },
            {
                en:"You claim that customer feedback drive what must be done.",
                fr:`Tu revendiques que l'utilisateur final est la source de décision sur ce qui doit être fait.`
            }
        ],
        productAndServices:[
            {
                en:"Bangarang is an open source and free direct democratic claim system. It allows anybody to declare or search for claim and claiming for them anonymously.",
                fr:`Bangarang est système Open Source et gratuit de démocratie directe à base de revendications permettant à chacun de déclarer ou rechercher une revendication et de revendiquer anonymement.`
            }
        ],
        gainCreators:[
            {
                en:"Your software will be more focused on adding value for customers.",
                fr:`Ton logiciel sera plus focus sur l'apport de valeur pour ses utilisateurs.`
            },
            {
                en:"Your business objectives will be reach with better results.",
                fr:`Tes objectifs métiers seront atteints avec de meilleurs résultats.`
            },
            {
                en:"You are owners of the product.",
                fr:`Tu es propriétaire et souverain du produit.`
            },
            {
                en:"Your customers satisfaction will be enhanced.",
                fr:`La satisfaction de tes utilisateurs sera améliorée.`
            }
        ],
        gains:[
            {
                en:"You value individuals and interactions over processes and tools.",
                fr:`Tu mets en valeur les individus et leurs intéractions plus que les processus et les outils.`
            },
            {
                en:"You value a working software over comprehensive documentation.",
                fr:`Tu mets en valeur un logiciel opérationnel plus qu'une documentation exhaustive.`
            },
            {
                en:"You value customer collaboration over contract negotiation.",
                fr:`Tu mets en valeur la collaboration avec les parties prennantes plus que la négociation contractuelle.`
            },
            {
                en:"You value responding to change over following a plan.",
                fr:`Tu mets en valeur l'adaptation au changement plus que le suivi d'un plan.`
            }
        ],
        linkName:{
            en:"Are you an agile team member?",
            fr:`Es-tu membre d'équipe agile?`
        },
        pageLink:"agileTeamMember"
    }
]

export const painRelieversToSupportingHeadLine = (language:Language, supportingHeadLine:string):string => new Message({
    en: supportingHeadLine,
    fr:supportingHeadLine
}).getMessage(language)
