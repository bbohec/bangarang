import type { ValuePropositionDesignCanvasContract } from "../../interfaces/ValuePropositionCanvasContract";
import { Language, Message } from "../language";
export const valuePropositionsDesignCanvas:ValuePropositionDesignCanvasContract[]= [
    {
        title:{en:"Activist Value Proposition",fr:`*** TRADUCTION MANQUANTE ***`},
        audience:{en:"Activist",fr:`*** TRADUCTION MANQUANTE ***`},
        customerJobs:[
            {en:"You revendicate your ideas.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You collectively commit to a cause.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"Your are pacifist.",fr:`*** TRADUCTION MANQUANTE ***`}
        ],
        pains:[
            {en:"You suffer too much violence during protest.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You have to be disobedient.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You die or you are hurt while you protest.",fr:`*** TRADUCTION MANQUANTE ***`}
        ],
        painRelievers:[
            {en:"You will claim from anyware.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"Does claiming from home is a disobedience?",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You will not claim by protesting anymore.",fr:`*** TRADUCTION MANQUANTE ***`}
        ],
        productAndServices:[
            {en:"Bangarang is an open source and free direct democratic claim system. It allows anybody to declare or search for claim and claiming for them anonymously.",fr:`*** TRADUCTION MANQUANTE ***`}
        ],
        gainCreators:[
            {en:"You can claim whatever you want.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You can change your mind.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You have as much power as the others.",fr:`*** TRADUCTION MANQUANTE ***`}
        ],
        gains:[
            {en:"You can claim on what makes sense to you.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You have the right like everyone else to make mistakes.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You do direct democracy.",fr:`*** TRADUCTION MANQUANTE ***`}
        ],
        linkName:{en:"Are you an activist?",fr:`*** TRADUCTION MANQUANTE ***`},
        pageLink:"activist"
    },
    {
        title:{en:"Syndicalist Value Proposition",fr:`*** TRADUCTION MANQUANTE ***`},
        audience:{en:"Syndicalist",fr:`*** TRADUCTION MANQUANTE ***`},
        customerJobs:[
            {en:"You defend your interests as a worker.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You show solidarity with your colleagues.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You struggle daily for immediate improvements in work but also for the disappearance of salaried workers and employers.",fr:`*** TRADUCTION MANQUANTE ***`}
        ],
        pains:[
            {en:"You are often divided.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You are individualist.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You die at work.",fr:`*** TRADUCTION MANQUANTE ***`}
        ],
        painRelievers:[
            {en:"You will claim on common causes.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You will be free to claim without being unionized.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"We will make a strong claim on workplace safety.",fr:`*** TRADUCTION MANQUANTE ***`}
        ],
        productAndServices:[
            {en:"Bangarang is an open source and free direct democratic claim system. It allows anybody to declare or search for claim and claiming for them anonymously.",fr:`*** TRADUCTION MANQUANTE ***`}
        ],
        gainCreators:[
            {en:"You are unified by the number but independent by your choices.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You can change your mind.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You can claim as much as your employer.",fr:`*** TRADUCTION MANQUANTE ***`}
        ],
        gains:[
            {en:"You and your colleagues will be more united.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You have the right like everyone else to make mistakes.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You greatly reduce the disparities between employers and employees.",fr:`*** TRADUCTION MANQUANTE ***`}
        ],
        linkName:{en:"Are you a syndicalist?",fr:`*** TRADUCTION MANQUANTE ***`},
        pageLink:"syndicalist"
    },
    {
        title:{en:"Agile Team Member Value Proposition",fr:`*** TRADUCTION MANQUANTE ***`},
        audience:{en:"Agile Team Member",fr:`*** TRADUCTION MANQUANTE ***`},
        customerJobs:[
            {en:"We are uncovering better ways of developing software by doing it and helping others do it.",fr:`*** TRADUCTION MANQUANTE ***`}
        ],
        pains:[
            {en:"You have more process and tools instead of individuals and interactions.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You have focus documentation instead of working software.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You take lot of time on contract negotiation over customer collaboration.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You have to follow THE PLAN instead of responding to change.",fr:`*** TRADUCTION MANQUANTE ***`}
        ],
        painRelievers:[
            {en:"You claim how the software should be.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You claim the rule that documentation is optionnal but working software is mandatory.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You claim NO ESTIMATE.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You claim that customer feedback drive what must be done.",fr:`*** TRADUCTION MANQUANTE ***`}
        ],
        productAndServices:[
            {en:"Bangarang is an open source and free direct democratic claim system. It allows anybody to declare or search for claim and claiming for them anonymously.",fr:`*** TRADUCTION MANQUANTE ***`}
        ],
        gainCreators:[
            {en:"Your software will be more focused on customer needs.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"Your business objectives will be reach with better results.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You are owners of the product.",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"Your customers satisfaction will be enhanced.",fr:`*** TRADUCTION MANQUANTE ***`}
        ],
        gains:[
            {en:"You value individuals and interactions over processes and tools",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You value a working software over comprehensive documentation",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You value customer collaboration over contract negotiation",fr:`*** TRADUCTION MANQUANTE ***`},
            {en:"You value responding to change over following a plan",fr:`*** TRADUCTION MANQUANTE ***`}
        ],
        linkName:{en:"Are you an agile team member?",fr:`*** TRADUCTION MANQUANTE ***`},
        pageLink:"agileTeamMember"
    }
]

export const painRelieversToSupportingHeadLine = (language:Language, supportingHeadLine:string):string => new Message({
    en:`Use Bangarang and ${supportingHeadLine.toLocaleLowerCase()}`,
    fr:`Utilisez Bangarang et ${supportingHeadLine.toLocaleLowerCase()}`
}).getMessage(language)
