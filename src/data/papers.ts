// src/data/papers.ts
import { PapersData } from "@/types/paper";

export const papersData: PapersData = {
    emma: {
        title: "EMMA: Emergency Medicine Mentoring Agent",
        abstract:
            "This paper presents EMMA (Emergency Medicine Mentoring Agent), a retrieval-augmented generation system designed to answer medical licensing examination questions. EMMA combines named entity recognition, unsupervised topic clustering via BERTopic, specialty classification, and FAISS-based dense retrieval to route questions to the most relevant context before invoking a large language model for explanation generation. The system is evaluated on the MedQA benchmark, demonstrating that deterministic, auditable routing components can substantially improve retrieval precision without sacrificing interpretability. Ablation studies isolate the contribution of each pipeline stage, and error analysis reveals systematic failure modes tied to ambiguous clinical terminology and cross-specialty overlap.",
        venue: ["Research Report", "University of Ottawa"],
        duration: {
            start: new Date("2026-03-15"),
            end: new Date("2026-04-15")
        },
        tags: [
            "NLP",
            "RAG",
            "BERTopic",
            "FAISS",
            "Medical AI",
            "Python",
            "LLM",
            "NER",
        ],
        projectId: "emma",
        links: {
            thesis: { label: "Thesis Format", type: "paper" },
            acm: { label: "ACM Format", type: "paper" },
            project: { label: "Linked Project", type: "project" },
        },
    },

    "beyond-helpful": {
        title: "Beyond Helpful: A Survey of Ethical Violations in Parasocial Companionships with AVAs",
        abstract:
            "The transmission of human emotional states to machines will create new possibilities to enhance educational and therapeutic standards. The wide spectrum of affective applications makes it difficult to capture their widely varying safetyrequirements into one generic framework. The real-time processing of emotional data and response generation at the commercial level faces multiple challenges during unsupervised real-world scenarios. This article identifies specific obstacles while presenting a critical survey of commercially deployed affective virtual agents. The survey (1) targets documented safety failures and boundary violations to define the gap between research ethics and industry practice, (2) deployment data is collected from recent incidents involving Character.AI, Replika, Snapchat's My AI, and xAI's Grok; and (3) the analysis examines exact hurdles in age verification protocols and user consent mechanisms. Proposed technical interventions and future research directions collectively target the prevention of parasocial harm.",
        venue: ["Literature Survey", "University of Ottawa"],
        duration: {
            start: new Date("2026-02-18"),
            end: new Date("2026-02-27")
        },
        tags: [
            "Affective Computing",
            "AI Safety",
            "AI Ethics",
            "AI Governance",
            "Virtual Agents",
            "Parasocial Relationships",
            "AI Governance",
            "HCI",
        ],
        projectId: "beyond-helpful",
        links: {
            acm: { label: "ACM Format", type: "paper" }
        },
    },

    "solarwinds-confronts-starburst": {
        title: "SolarWinds Confronts Starburst: A Post-Mortem Analysis of the Sunburst Campaign and Its Implications for Software Supply Chain Security",
        abstract:
            "The SUNBURST campaign, attributed to the APT29 group, represents a watershed moment in cybersecurity, exposing critical vulnerabilities in software supply chains. This paper provides a comprehensive post-mortem analysis of the attack, detailing the sophisticated techniques employed by the adversary, including novel code obfuscation and multi-stage payload delivery. We evaluate the attack's impact on national security, industry practices, and public awareness, and analyze the response strategies deployed by SolarWinds and affected organizations. The paper concludes with actionable recommendations for enhancing software supply chain security, emphasizing the need for proactive threat intelligence sharing, robust code integrity verification, and comprehensive incident response planning.",
        venue: ["Research Report", "University of Ottawa"],
        duration: {
            start: new Date("2025-12-02"),
            end: new Date("2025-12-12")
        },
        tags: [
            "Cybersecurity",
            "Software Supply Chain",
            "APT29",
            "Incident Response",
            "Threat Intelligence",
            "Security Analysis",
            "NIST CSF",
            "MITRE ATT&CK",
            "Microsoft STRIDE",
            "Microsoft Threat Modeling",
            "SolarWinds",
            "Starburst",
        ],
        links: {
            ieee: { label: "IEEE Format", type: "paper" }
        },
    },

    "prompt-based-web-services-and-api-design": {
        title: "Prompt-Based Web Services and API Design: A New Paradigm for Natural Language Interfaces",
        abstract: "Large Language Models have transformed web service architecture by introducing prompt-based APIs that accept natural language instructions rather than structured parameters. This survey examines the paradigm shift from REST APIs to prompt-based services, analyzing design patterns, implementation challenges, and security considerations including prompt injection attacks. Through comparative analysis of existing literature and an AWS Bedrock implementation using Amazon Nova Micro (\$0.000035 per 1,000 input tokens), we demonstrate that intelligent model selection matching task complexity to capacity achieves substantial cost savings. Our evaluation of prompt templating, output extraction, and testing methodologies reveals that prompt-based APIs offer flexibility but introduce challenges in validation, consistency, and versioning. We propose design recommendations for hybrid architectures combining RESTful principles with prompt-based interfaces. This work provides practitioners with evidence-based guidance for integrating LLMs into production web services.",
        venue: ["Literature Survey", "University of Ottawa"],
        duration: {
            start: new Date("2025-12-04"),
            end: new Date("2025-12-11")
        },
        tags: [
            "NLP",
            "API Design",
            "Web Services",
            "AWS Bedrock",
            "Prompt Engineering",
            "LLM",
            "Security",
        ],
        links: {
            acm: { label: "ACM Format", type: "paper" },
            presentation: { label: "Presentation", type: "slides" },
        },
    },


    "evse-opt": {
        title: "EVSE Network Optimization in the KWC CMA",
        abstract:
            "This paper formulates and solves a mixed-integer programming model for the optimal placement and capacity allocation of electric vehicle (EV) charging stations across the Region of Waterloo, Ontario. The model jointly minimizes total infrastructure cost while maximizing coverage of EV-owning households and transit nodes, subject to grid capacity constraints and minimum port requirements. A multi-phase implementation plan is derived from the optimization output, prioritizing Level 2 to Level 3 upgrades at high-demand sites before greenfield Level 3 deployment. Sensitivity analysis reveals that budget constraints are the binding bottleneck, and that targeted grid upgrades yield disproportionate coverage gains.",
        venue: ["Research Report", "University of Waterloo"],
        duration: {
            start: new Date("2024-12-01"),
            end: new Date("2024-12-20")
        },
        tags: [
            "Operations Research",
            "MILP",
            "Gurobi",
            "Python",
            "GIS",
            "EV Infrastructure",
            "Optimization",
            "Waterloo Region",
        ],
        projectId: "evse-opt",
        links: {
            thesis: {
                label: "Thesis Format",
                type: "paper",
            },
            project: {
                label: "Linked Project",
                type: "project",
            },
        },
    },

    "qcc-dde": {
        title: "Relapse Thresholds in QCC Dormancy: A DDE Model for Tumor Growth",
        abstract:
            "Mathematical models are valuable tools for understanding tumor growth dynamics. This paper proposes a novel extension to an existing delay differential equation model that incorporates the immune system's response and a cell cycle-specific drug. The extended model distinguishes three key populations: proliferating tumor cells, dividing tumor cells (mitosis), and immune cells. The delay term accounts for the time spent by tumor cells in the interphase before entering mitosis. We analyze the model's stability using the argument principle and establish a theorem that links stability to the time delay. Furthermore, we demonstrate the potential for periodic solutions arising through Hopf bifurcations, explored both theoretically and numerically. The paper also addresses the rationale behind excluding the quiescent cancer cell population ($G_0$) from the base model and discusses the potential impact of their reactivation on tumor recurrence. This comprehensive approach provides a deeper understanding of the interplay between tumor growth, immune response, and cell cycle-specific drugs.",
        venue: ["Research Report", "University of Waterloo"],
        duration: {
            start: new Date("2024-04-04"),
            end: new Date("2024-04-24")
        },
        tags: [
            "Mathematical Biology",
            "Delay Differential Equations",
            "Tumor Growth",
            "Immune Response",
            "Hopf Bifurcation",
            "Stability Analysis",
            "Python",
        ],
        projectId: "qqc-dde",
        links: {
            acm: {
                label: "ACM Format",
                type: "paper",
            },
            thesis: {
                label: "Thesis Format",
                type: "paper",
            },
            presentation: {
                label: "Presentation",
                type: "slides",
            },
        },
    },

    "a-symphony-of-safeguards": {
        title: "A Symphony of Safeguards: The Case for Multi-Layered AI Regulation",
        abstract:
            "Artificial Intelligence is rapidly transforming consequential domains, from facial recognition in law enforcement to clinical decision support in healthcare, raising urgent questions about how, or whether, to regulate it. This essay argues that no single regulatory mechanism is adequate: transparency requirements, accountability frameworks, risk-stratified oversight, and meaningful human control are each necessary but independently insufficient. This essay advances a multi-layered approach that harmonizes these four pillars into a coherent governance architecture, drawing on emerging regulatory frameworks and empirical evidence from algorithmic decision-making. The essay evaluates the benefits and limitations of this approach, emphasizing that effective AI governance requires continuous adaptation, international coordination, and substantive public engagement.",
        venue: ["Academic Essay", "University of Waterloo"],
        duration: {
            start: new Date("2024-03-27"),
            end: new Date("2024-03-30")
        },
        tags: [
            "Ethics",
            "AI Regulation",
            "AI Governance",
            "Transparency",
            "Accountability",
            "Risk Stratification",
            "Human Control",
            "HCI",
            "Human-AI Interaction",
        ],
        links: {
            essay: {
                label: "PDF",
                type: "paper",
            },
        },
    },

    "data-for-whom": {
        title: "Data for Whom: Responsible Data Collection in the Global South",
        abstract:
            "Technology companies from wealthy nations increasingly collect data from developing countries, presenting a double-edged opportunity: the potential for development impact alongside the risk of perpetuating extractive, neocolonial dynamics. This essay identifies six principles that should govern responsible data collection in these contexts: local context engagement and collaborative partnerships; informed consent with culturally adapted mechanisms; data minimization; local capacity building; robust data security adapted to infrastructure constraints; and fair benefit sharing with host communities. Underlying all six is a structural imperative: a conscious rejection of data colonialism, in which companies must operate as partners respecting local sovereignty rather than as external actors extracting a resource.",
        venue: ["Academic Essay", "University of Waterloo"],
        duration: {
            start: new Date("2024-03-15"),
            end: new Date("2024-03-18")
        },
        tags: [
            "Ethics",
            "Data Governance",
            "Global Development",
            "Informed Consent",
            "Data Colonialism",
            "Privacy",
            "HCI",
        ],
        links: {
            essay: {
                label: "PDF",
                type: "paper",
            },
        },
    },

    "handle-with-care": {
        title: "Handle With Care: The Conditional Case for Mental Health Chatbots in Personal Treatment",
        abstract:
            "Mental health chatbots have emerged as a scalable and accessible complement to traditional care in a landscape defined by chronic provider shortages and persistent stigma. A growing body of randomized controlled trials and meta-analyses demonstrates that purpose-built AI chatbots can produce clinically meaningful reductions in symptoms of depression and anxiety, often through delivery of CBT-informed interventions. Yet serious concerns remain: unregulated deployment, privacy vulnerabilities, the absence of crisis detection protocols, and the risk of substituting rather than supplementing professional care. This essay takes a conditional position, arguing that a chatbot should be encouraged as a structured adjunct to professional treatment, not a replacement for it, with careful guidance about platform selection, privacy awareness, and the limits of what conversational AI can perceive and respond to.",
        venue: ["Academic Essay", "University of Waterloo"],
        duration: {
            start: new Date("2024-03-01"),
            end: new Date("2024-03-04")
        },
        tags: [
            "Ethics",
            "Mental Health",
            "Conversational AI",
            "Digital Health",
            "AI Safety",
            "Accessibility",
            "HCI",
            "Human-AI Interaction",
        ],
        links: {
            essay: {
                label: "PDF",
                type: "paper",
            },
        },
    },

    "rooted-in-the-land": {
        title: "Rooted in the Land: Redesigning GPS Through Indigenous Perspectives",
        abstract:
            "The Global Positioning System was designed around Western cartographic conventions: standardized coordinates, abstracted overhead views, and value-neutral maps that strip landscapes of cultural meaning. This essay examines Indigenous navigation epistemologies grounded in relational knowledge of land, celestial bodies, and ecological cues, and proposes four pillars for a genuinely inclusive redesign: integration of traditional knowledge and environmental navigation cues, meaningful community co-design, built-in cultural sensitivity protections for sacred and restricted sites, and features that promote ecological interconnectedness. Two case studies, the CyberTracker project in South Africa and the Maori Maps initiative in New Zealand, demonstrate that such integration produces technology that is more accurate, culturally preserving, and community-empowering than any top-down alternative.",
        venue: ["Academic Essay", "University of Waterloo"],
        duration: {
            start: new Date("2024-02-02"),
            end: new Date("2024-02-05")
        },
        tags: [
            "Ethics",
            "Indigenous Knowledge",
            "Participatory Design",
            "Cultural Sensitivity",
            "Decolonial Technology",
            "Navigation",
            "HCI",
        ],
        links: {
            essay: {
                label: "PDF",
                type: "paper",
            },
        },
    },

    "healing-the-algorithm": {
        title: "Healing the Algorithm: The Case for Comprehensive Metrics and Explainable AI in Healthcare Allocation",
        abstract:
            "Widely deployed risk-stratification tools have been shown to encode racial and socioeconomic bias, primarily because they conflate healthcare cost with healthcare need. This essay proposes two concrete technical reforms: replacing cost-based risk scores with a comprehensive, multi-dimensional health-metrics framework updated continuously via reinforcement learning, and embedding explainable AI and independent auditing mechanisms directly into the algorithm's architecture so that every allocation decision can be inspected, contested, and corrected in real time. The essay argues that these reforms are preferable to alternatives such as demographic re-weighting or post-hoc bias correction, which treat symptoms rather than causes.",
        venue: ["Academic Essay", "University of Waterloo"],
        duration: {
            start: new Date("2024-01-27"),
            end: new Date("2024-01-29")
        },
        tags: [
            "Ethics",
            "Algorithmic Bias",
            "Health Equity",
            "Explainable AI",
            "Machine Learning",
            "Auditing",
            "Risk Stratification",
            "HCI",
            "Human-AI Interaction",
        ],
        links: {
            essay: {
                label: "PDF",
                type: "paper",
            },
        },
    },

    "holistic-fairness": {
        title: "Holistic Fairness: Why Neither Equality Nor Process Is Enough",
        abstract:
            "Fairness is among the most contested yet consequential concepts in moral and political philosophy. This essay initiated its exploration by arguing whether neither egalitarian fairness, which prioritizes equal distribution of outcomes, nor procedural fairness, which emphasizes just processes, is independently sufficient to achieve justice. Eventually, it advances a synthesized account called \"holistic fairness\": a framework that treats equitable starting conditions and transparent, inclusive processes as mutually necessary and jointly constitutive of a just society. Drawing on philosophical, legal, and empirical literature, the essay evaluates the internal limitations of each traditional definition before defending holistic fairness as a more adaptable, culturally sensitive, and practically applicable standard for contemporary governance and social organization.",
        venue: ["Academic Essay", "University of Waterloo"],
        duration: {
            start: new Date("2024-01-12"),
            end: new Date("2024-01-15")
        },
        tags: [
            "Ethics",
            "Fairness",
            "Distributive Justice",
            "Procedural Justice",
            "Ethical Frameworks",
            "Case Studies",
        ],
        links: {
            essay: {
                label: "PDF",
                type: "paper",
            },
        },
    },
};
