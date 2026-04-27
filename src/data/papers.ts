// src/data/papers.ts
import { PapersData } from "@/types/paper";

export const papersData: PapersData = {
    "emma": {
        title: "EMMA: Emergency Medicine Mentoring Agent",
        abstract:
            "This paper presents EMMA (Emergency Medicine Mentoring Agent), a retrieval-augmented generation system designed to answer medical licensing examination questions. EMMA combines named entity recognition, unsupervised topic clustering via BERTopic, specialty classification, and FAISS-based dense retrieval to route questions to the most relevant context before invoking a large language model for explanation generation. The system is evaluated on the MedQA benchmark, demonstrating that deterministic, auditable routing components can substantially improve retrieval precision without sacrificing interpretability. Ablation studies isolate the contribution of each pipeline stage, and error analysis reveals systematic failure modes tied to ambiguous clinical terminology and cross-specialty overlap.",
        paperType: "Research Report",
        venue: ["University of Ottawa"],
        duration: {
            start: new Date("2026-03-15"),
            end: new Date("2026-04-15")
        },
        tags: [
            "ML + NLP",
            "AI + LLM",
            "Digital Health",
            "Computational Biology",
        ],
        projectId: "emma",
        links: {
            thesis: { label: "Thesis Format", type: "paper" },
            acm: { label: "ACM Format", type: "paper" },
            project: { label: "Linked Project", type: "project" },
            bib: { label: "BibTeX", type: "bib" },
        },
    },

    "beyond-helpful": {
        title: "Beyond Helpful: Ethical Violations in AI Parasocial Companionships",
        abstract:
            "The transmission of human emotional states to machines will create new possibilities to enhance educational and therapeutic standards. The wide spectrum of affective applications makes it difficult to capture their widely varying safetyrequirements into one generic framework. The real-time processing of emotional data and response generation at the commercial level faces multiple challenges during unsupervised real-world scenarios. This article identifies specific obstacles while presenting a critical survey of commercially deployed affective virtual agents. The survey (1) targets documented safety failures and boundary violations to define the gap between research ethics and industry practice, (2) deployment data is collected from recent incidents involving Character.AI, Replika, Snapchat's My AI, and xAI's Grok; and (3) the analysis examines exact hurdles in age verification protocols and user consent mechanisms. Proposed technical interventions and future research directions collectively target the prevention of parasocial harm.",
        paperType: "Literature Survey",
        venue: ["University of Ottawa"],
        duration: {
            start: new Date("2026-02-18"),
            end: new Date("2026-02-27")
        },
        tags: [
            "Affective + Persuasive Computing",
            "HCI",
            "AI + LLM", "Ethics",
            "Governance",
            "Human-AI Interaction"
        ],
        projectId: "beyond-helpful",
        links: {
            acm: { label: "ACM Format", type: "paper" },
            bib: { label: "BibTeX", type: "bib" },
        },
    },

    "solarwinds-confronts-sunburst": {
        title: "SolarWinds Confronts SUNBURST: A Post-Mortem Analysis",
        abstract:
            "The SUNBURST campaign, attributed to the APT29 group, represents a watershed moment in cybersecurity, exposing critical vulnerabilities in software supply chains. This paper provides a comprehensive post-mortem analysis of the attack, detailing the sophisticated techniques employed by the adversary, including novel code obfuscation and multi-stage payload delivery. We evaluate the attack's impact on national security, industry practices, and public awareness, and analyze the response strategies deployed by SolarWinds and affected organizations. The paper concludes with actionable recommendations for enhancing software supply chain security, emphasizing the need for proactive threat intelligence sharing, robust code integrity verification, and comprehensive incident response planning.",
        paperType: "Case Study",
        venue: ["University of Ottawa"],
        duration: {
            start: new Date("2025-12-02"),
            end: new Date("2025-12-12")
        },
        tags: [
            "Cybersecurity",
            "Supply Chain + Organization",
        ],
        links: {
            ieee: { label: "IEEE Format", type: "paper" },
            bib: { label: "BibTeX", type: "bib" },
        },
    },

    "prompt-based-web-services-and-api-design": {
        title: "Prompt-Based Web Services and API Design: A New Paradigm for Natural Language Interfaces",
        abstract: "Large Language Models have transformed web service architecture by introducing prompt-based APIs that accept natural language instructions rather than structured parameters. This survey examines the paradigm shift from REST APIs to prompt-based services, analyzing design patterns, implementation challenges, and security considerations including prompt injection attacks. Through comparative analysis of existing literature and an AWS Bedrock implementation using Amazon Nova Micro (\$0.000035 per 1,000 input tokens), we demonstrate that intelligent model selection matching task complexity to capacity achieves substantial cost savings. Our evaluation of prompt templating, output extraction, and testing methodologies reveals that prompt-based APIs offer flexibility but introduce challenges in validation, consistency, and versioning. We propose design recommendations for hybrid architectures combining RESTful principles with prompt-based interfaces. This work provides practitioners with evidence-based guidance for integrating LLMs into production web services.",
        paperType: "Literature Survey",
        venue: ["University of Ottawa"],
        duration: {
            start: new Date("2025-12-04"),
            end: new Date("2025-12-11")
        },
        tags: [
            "ML + NLP",
            "AI + LLM",
            "API + Web Services",
        ],
        links: {
            acm: { label: "ACM Format", type: "paper" },
            presentation: { label: "Presentation", type: "slides" },
            bib: { label: "BibTeX", type: "bib" },
        },
    },

    "not-your-trolleys-problem": {
        title: "Not Your Trolley's Problem: A Multi-Domain Ethics Framework for Autonomous Vehicles",
        abstract:
            "The trolley problem has a problem. Public and scholarly discourse on the ethics of autonomous vehicles has been dominated by the collision-scenario paradigm: the question of how a vehicle should be programmed to allocate harm when an accident is unavoidable. This framing, inherited from the philosophical trolley problem, has generated extensive debate but systematically obscures three equally consequential ethical domains that receive far less attention: in-cabin surveillance and data privacy, algorithmic accountability and liability, and the welfare implications for vulnerable road users and third parties. This paper argues that this narrow focus is not merely incomplete but actively distorting, because it frames the ethics of Autonomous Vehicle (AV) design as a problem of exceptional crisis decision-making rather than as a pervasive set of design choices embedded in every feature of the technology. Drawing on Millar's ethics settings framework, the Moral Machine experiment, and the emerging literature on AV data collection and in-cabin wellness systems, the paper proposes a multi-domain ethics framework that treats collision algorithms as one ethics setting among many, and argues that the non-collision domains carry greater aggregate ethical weight because they affect every trip rather than only the rare catastrophic accident.",
        venue: ["University of Ottawa"],
        paperType: "Academic Essay",
        duration: {
            start: new Date("2025-12-20"),
            end: new Date("2025-12-23")
        },
        tags: [
            "Ethics",
            "Privacy + Security",
            "AI + LLM",
            "Robotics",
            "HCI",
            "Policy",
        ],
        links: {
            ieee: { label: "IEEE Format", type: "paper" },
            bib: { label: "BibTeX", type: "bib" },
        },
    },

    "designed-to-deceive": {
        title: "Designed to Deceive: Social Failure Modes and the Metaphors That Enable Them in Domestic Social Robots",
        abstract:
            "Domestic social robots are designed to enter the most private spaces in human life while carrying surveillance capabilities systematically concealed by the companion metaphors through which they are framed. This paper argues, through complementary analyses of Jibo and NEO, that the companion metaphor is not merely a marketing choice but the functional mechanism that enables a specific and predictable social failure mode: the norm transgression failure that occurs when a technology's embedded design norms violate the privacy expectations of users. Drawing on Millar's social failure mode framework and the Metaphor Hacking methodology of Jones and Millar, the paper demonstrates that companion framing suppresses the privacy vigilance that would otherwise protect users, and removes the conceptual resources needed to recognize violations. Remedying this requires reconceiving the fundamental framing of the technology, not merely adding privacy features to existing designs.",
        venue: ["University of Ottawa"],
        paperType: "Case Study",
        duration: {
            start: new Date("2025-11-06"),
            end: new Date("2025-11-13")
        },
        tags: [
            "Ethics",
            "HCI",
            "Privacy + Security",
        ],
        links: {
            ieee: { label: "IEEE Format", type: "paper" },
            bib: { label: "BibTeX", type: "bib" },
        },
    },

    "mind-the-gap": {
        title: "Mind the Gap: A Structured Survey of AI Mental Health Technologies and Their Equity Failures for Marginalized Populations",
        abstract:
            "The rapid proliferation of AI-powered mental health technologies has produced a field defined by a foundational paradox: the populations most in need of accessible, affordable care are precisely those most likely to be harmed by current deployment practices. Queer, neurodivergent, disabled, racially and ethnically minoritized, and culturally diverse individuals face disproportionate barriers to traditional therapy and have turned to AI-driven conversational tools in substantial numbers. Yet systematic evidence reveals that these tools, designed predominantly on majority-population data and deployed without equity infrastructure, reproduce and often deepen the inequities they ostensibly address. This survey synthesizes evidence from 35 peer-reviewed sources published between 2020 and 2025, encompassing randomized controlled trials, systematic reviews and meta-analyses, observational studies, qualitative investigations, and policy analyses. Organized around three central questions (effectiveness, risk, and conditions for safe deployment), it identifies six converging patterns: purpose-built interventions outperform general-purpose tools; cultural adaptation and community co-design are safety requirements rather than optional enhancements; accessibility failures systematically exclude disabled users; crisis management infrastructure lags dangerously behind deployment; LLM demographic bias is empirically documented and pervasive; and safety standards remain underdeveloped relative to scale. The survey concludes by proposing an equity-centered design framework and identifying five critical gaps that the research community must urgently address.",
        paperType: "Literature Survey",
        venue: ["University of Ottawa"],
        duration: {
            start: new Date("2025-10-11"),
            end: new Date("2026-10-19")
        },
        tags: [
            "AI + LLM",
            "Ethics",
            "Digital Health",
            "HCI",
            "Human-AI Interaction",
            "Governance",
            "Policy",
        ],
        links: {
            ieee: { label: "IEEE Format", type: "paper" },
            bib: { label: "BibTeX", type: "bib" },
        },
    },

    "human-centered-theater": {
        title: "Human-Centered Theater: Overcoming Organizational Resistance to Authentic UX",
        abstract:
            "Despite twenty-five years of advocacy for human-centered design principles, organizational adoption remains paradoxically limited across industries. This essay challenges conventional narratives that attribute slow implementation to organizational ignorance. Instead, it proposes that resistance reflects rational calculations about cultural transformation costs and the disruption of entrenched power structures. Through a systematic examination of design thinking's benefits, adoption barriers, and implementation strategies, this critique argues that authentic human-centered approaches face resistance due to their intensive implementation requirements rather than methodological shortcomings. While superficial 'human-centered theater' allows organizations to claim user-centricity without meaningful change, authentic implementation requires fundamental shifts in organizational values and measurement systems that many leadership teams are unwilling to undertake.",
        paperType: "Academic Essay",
        venue: ["University of Ottawa"],
        duration: {
            start: new Date("2025-09-16"),
            end: new Date("2025-09-21")
        },
        tags: [
            "HCI", "UXR",
            "Human-Centered Design",
            "Supply Chain + Organization",
        ],
        links: {
            essay: { label: "PDF", type: "paper" },
            bib: { label: "BibTeX", type: "bib" },
        },
    },

    "evse-opt": {
        title: "EVSE Network Optimization in the KWC CMA",
        abstract:
            "This paper formulates and solves a mixed-integer programming model for the optimal placement and capacity allocation of electric vehicle (EV) charging stations across the Region of Waterloo, Ontario. The model jointly minimizes total infrastructure cost while maximizing coverage of EV-owning households and transit nodes, subject to grid capacity constraints and minimum port requirements. A multi-phase implementation plan is derived from the optimization output, prioritizing Level 2 to Level 3 upgrades at high-demand sites before greenfield Level 3 deployment. Sensitivity analysis reveals that budget constraints are the binding bottleneck, and that targeted grid upgrades yield disproportionate coverage gains.",
        paperType: "Research Report",
        venue: ["University of Waterloo"],
        duration: {
            start: new Date("2024-12-01"),
            end: new Date("2024-12-20")
        },
        tags: [
            "Operations Research",
            "Supply Chain + Organization",
            "Geomatics",
        ],
        projectId: "evse-opt",
        links: {
            thesis: { label: "Thesis Format", type: "paper" },
            project: { label: "Linked Project", type: "project" },
            bib: { label: "BibTeX", type: "bib" },
        },
    },

    "qcc-dde": {
        title: "Relapse Thresholds in QCC Dormancy: A DDE Model for Tumor Growth",
        abstract:
            "Mathematical models are valuable tools for understanding tumor growth dynamics. This paper proposes a novel extension to an existing delay differential equation model that incorporates the immune system's response and a cell cycle-specific drug. The extended model distinguishes three key populations: proliferating tumor cells, dividing tumor cells (mitosis), and immune cells. The delay term accounts for the time spent by tumor cells in the interphase before entering mitosis. We analyze the model's stability using the argument principle and establish a theorem that links stability to the time delay. Furthermore, we demonstrate the potential for periodic solutions arising through Hopf bifurcations, explored both theoretically and numerically. The paper also addresses the rationale behind excluding the quiescent cancer cell population ($G_0$) from the base model and discusses the potential impact of their reactivation on tumor recurrence. This comprehensive approach provides a deeper understanding of the interplay between tumor growth, immune response, and cell cycle-specific drugs.",
        paperType: "Research Report",
        venue: ["University of Waterloo"],
        duration: {
            start: new Date("2024-04-04"),
            end: new Date("2024-04-24")
        },
        tags: [
            "Computational Biology",
        ],
        projectId: "qqc-dde",
        links: {
            acm: { label: "ACM Format", type: "paper" },
            thesis: { label: "Thesis Format", type: "paper" },
            presentation: { label: "Presentation", type: "slides" },
            bib: { label: "BibTeX", type: "bib" },
        },
    },

    "i-knew-how-to-report-but-didnt": {
        title: "\"I Knew How to Report, But Didn't\": Awareness, Helplessness, and Platform Distrust in CSAM Reporting Among University Students",
        abstract:
            "This paper presents a cross-sectional survey study (n = 47) examining how university students at the University of Waterloo perceive, respond to, and reason about child sexual abuse material (CSAM) encountered on social media platforms. Data were collected between March and April 2024. Among respondents who confirmed an encounter (n = 25, 53.2\%), 80\% reported knowing how to file a report, yet only 44\% did so. Of those who reported, only one participant felt the platform took appropriate action; nine received no response or no visible action, and one described the outcome as ``never heard back.'' These findings reveal a structural reporting gap driven by two compounding dynamics: a bystander effect shaped by platform scale and perceived diffusion of responsibility, and platform distrust arising from repeated experiences of ineffectual moderation. Helplessness was the second most common emotional response (48\%), and 32\% of those who encountered CSAM ignored the content entirely. Against a backdrop of 36.2 million National Center for Missing and Exploited Children (NCMEC) CyberTipline reports and over 40,000 Cybertip.ca reports in Canada during 2023, and consistent user-side evidence that reporting mechanisms are neither trusted nor effective, this paper argues that the problem is not one of digital literacy but of structural accountability. Platform response quality, interface design, and mandatory outcome transparency are identified as the most likely levers for closing the gap between knowing how to report and actually doing so.",
        paperType: "Empirical Study",
        venue: ["University of Waterloo"],
        duration: {
            start: new Date("2024-03-10"),
            end: new Date("2025-05-01")
        },
        tags: [
            "Ethics",
            "Privacy + Security",
            "HCI",
            "Governance",
            "Policy",
        ],
        links: {
            ieee: { label: "IEEE Format", type: "paper" },
            bib: { label: "BibTeX", type: "bib" },
        },
    },

    "a-symphony-of-safeguards": {
        title: "A Symphony of Safeguards: The Case for Multi-Layered AI Regulation",
        abstract:
            "Artificial Intelligence is rapidly transforming consequential domains, from facial recognition in law enforcement to clinical decision support in healthcare, raising urgent questions about how, or whether, to regulate it. This essay argues that no single regulatory mechanism is adequate: transparency requirements, accountability frameworks, risk-stratified oversight, and meaningful human control are each necessary but independently insufficient. This essay advances a multi-layered approach that harmonizes these four pillars into a coherent governance architecture, drawing on emerging regulatory frameworks and empirical evidence from algorithmic decision-making. The essay evaluates the benefits and limitations of this approach, emphasizing that effective AI governance requires continuous adaptation, international coordination, and substantive public engagement.",
        paperType: "Academic Essay",
        venue: ["University of Waterloo"],
        duration: {
            start: new Date("2024-03-27"),
            end: new Date("2024-03-30")
        },
        tags: [
            "HCI",
            "AI + LLM", "Ethics",
            "Governance",
            "Human-AI Interaction",
        ],
        links: {
            essay: { label: "PDF", type: "paper" },
            bib: { label: "BibTeX", type: "bib" },
        },
    },

    "data-for-whom": {
        title: "Data for Whom: Responsible Data Collection in the Global South",
        abstract:
            "Technology companies from wealthy nations increasingly collect data from developing countries, presenting a double-edged opportunity: the potential for development impact alongside the risk of perpetuating extractive, neocolonial dynamics. This essay identifies six principles that should govern responsible data collection in these contexts: local context engagement and collaborative partnerships; informed consent with culturally adapted mechanisms; data minimization; local capacity building; robust data security adapted to infrastructure constraints; and fair benefit sharing with host communities. Underlying all six is a structural imperative: a conscious rejection of data colonialism, in which companies must operate as partners respecting local sovereignty rather than as external actors extracting a resource.",
        paperType: "Academic Essay",
        venue: ["University of Waterloo"],
        duration: {
            start: new Date("2024-03-15"),
            end: new Date("2024-03-18")
        },
        tags: [
            "HCI",
            "AI + LLM", "Ethics",
            "Governance",
            "Cybersecurity",
        ],
        links: {
            essay: { label: "PDF", type: "paper" },
            bib: { label: "BibTeX", type: "bib" },
        },
    },

    "handle-with-care": {
        title: "Handle With Care: The Conditional Case for Mental Health Chatbots in Personal Treatment",
        abstract:
            "Mental health chatbots have emerged as a scalable and accessible complement to traditional care in a landscape defined by chronic provider shortages and persistent stigma. A growing body of randomized controlled trials and meta-analyses demonstrates that purpose-built AI chatbots can produce clinically meaningful reductions in symptoms of depression and anxiety, often through delivery of CBT-informed interventions. Yet serious concerns remain: unregulated deployment, privacy vulnerabilities, the absence of crisis detection protocols, and the risk of substituting rather than supplementing professional care. This essay takes a conditional position, arguing that a chatbot should be encouraged as a structured adjunct to professional treatment, not a replacement for it, with careful guidance about platform selection, privacy awareness, and the limits of what conversational AI can perceive and respond to.",
        paperType: "Academic Essay",
        venue: ["University of Waterloo"],
        duration: {
            start: new Date("2024-03-01"),
            end: new Date("2024-03-04")
        },
        tags: [
            "HCI", "AI + LLM", "Ethics",
            "Digital Health",
            "Accessibility",
            "Human-AI Interaction",
        ],
        links: {
            essay: { label: "PDF", type: "paper" },
            bib: { label: "BibTeX", type: "bib" },
        },
    },

    "rooted-in-the-land": {
        title: "Rooted in the Land: Redesigning GPS Through Indigenous Perspectives",
        abstract:
            "The Global Positioning System was designed around Western cartographic conventions: standardized coordinates, abstracted overhead views, and value-neutral maps that strip landscapes of cultural meaning. This essay examines Indigenous navigation epistemologies grounded in relational knowledge of land, celestial bodies, and ecological cues, and proposes four pillars for a genuinely inclusive redesign: integration of traditional knowledge and environmental navigation cues, meaningful community co-design, built-in cultural sensitivity protections for sacred and restricted sites, and features that promote ecological interconnectedness. Two case studies, the CyberTracker project in South Africa and the Maori Maps initiative in New Zealand, demonstrate that such integration produces technology that is more accurate, culturally preserving, and community-empowering than any top-down alternative.",
        paperType: "Academic Essay",
        venue: ["University of Waterloo"],
        duration: {
            start: new Date("2024-02-02"),
            end: new Date("2024-02-05")
        },
        tags: [
            "HCI", "Ethics", "UXR",
            "Human-Centered Design",
            "Geomatics",
        ],
        links: {
            essay: { label: "PDF", type: "paper" },
            bib: { label: "BibTeX", type: "bib" },
        },
    },

    "healing-the-algorithm": {
        title: "Healing the Algorithm: The Case for Comprehensive Metrics and Explainable AI in Healthcare Allocation",
        abstract:
            "Widely deployed risk-stratification tools have been shown to encode racial and socioeconomic bias, primarily because they conflate healthcare cost with healthcare need. This essay proposes two concrete technical reforms: replacing cost-based risk scores with a comprehensive, multi-dimensional health-metrics framework updated continuously via reinforcement learning, and embedding explainable AI and independent auditing mechanisms directly into the algorithm's architecture so that every allocation decision can be inspected, contested, and corrected in real time. The essay argues that these reforms are preferable to alternatives such as demographic re-weighting or post-hoc bias correction, which treat symptoms rather than causes.",
        paperType: "Academic Essay",
        venue: ["University of Waterloo"],
        duration: {
            start: new Date("2024-01-27"),
            end: new Date("2024-01-29")
        },
        tags: [
            "HCI", "AI + LLM", "Ethics",
            "Human-AI Interaction",
        ],
        links: {
            essay: { label: "PDF", type: "paper" },
            bib: { label: "BibTeX", type: "bib" },
        },
    },

    "holistic-fairness": {
        title: "Holistic Fairness: Why Neither Equality Nor Process Is Enough",
        abstract:
            "Fairness is among the most contested yet consequential concepts in moral and political philosophy. This essay initiates by arguing that neither egalitarian fairness, which prioritizes equal distribution of outcomes, nor procedural fairness, which emphasizes just processes, is independently sufficient to achieve justice. Eventually, it advances a synthesized account called \"holistic fairness\": a framework that treats equitable starting conditions and transparent, inclusive processes as mutually necessary and jointly constitutive of a just society. Drawing on philosophical, legal, and empirical literature, the essay evaluates the internal limitations of each traditional definition before defending holistic fairness as a more adaptable, culturally sensitive, and practically applicable standard for contemporary governance and social organization.",
        paperType: "Academic Essay",
        venue: ["University of Waterloo"],
        duration: {
            start: new Date("2024-01-12"),
            end: new Date("2024-01-15")
        },
        tags: [
            "Ethics"
        ],
        links: {
            essay: { label: "PDF", type: "paper" },
            bib: { label: "BibTeX", type: "bib" },
        },
    },
};
