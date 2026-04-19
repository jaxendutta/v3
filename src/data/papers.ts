// src/data/papers.ts
import { PapersData } from "@/types/paper";

export const papersData: PapersData = {
    emma: {
        title: "EMMA: Emergency Medicine Mentoring Agent",
        abstract:
            "This paper presents EMMA (Emergency Medicine Mentoring Agent), a retrieval-augmented generation system designed to answer medical licensing examination questions. EMMA combines named entity recognition, unsupervised topic clustering via BERTopic, specialty classification, and FAISS-based dense retrieval to route questions to the most relevant context before invoking a large language model for explanation generation. The system is evaluated on the MedQA benchmark, demonstrating that deterministic, auditable routing components can substantially improve retrieval precision without sacrificing interpretability. Ablation studies isolate the contribution of each pipeline stage, and error analysis reveals systematic failure modes tied to ambiguous clinical terminology and cross-specialty overlap.",
        venue: ["Research", "University of Ottawa"],
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


    "evse-opt": {
        title: "EVSE Network Optimization in the KWC CMA",
        abstract:
            "This paper formulates and solves a mixed-integer programming model for the optimal placement and capacity allocation of electric vehicle (EV) charging stations across the Region of Waterloo, Ontario. The model jointly minimizes total infrastructure cost while maximizing coverage of EV-owning households and transit nodes, subject to grid capacity constraints and minimum port requirements. A multi-phase implementation plan is derived from the optimization output, prioritizing Level 2 to Level 3 upgrades at high-demand sites before greenfield Level 3 deployment. Sensitivity analysis reveals that budget constraints are the binding bottleneck, and that targeted grid upgrades yield disproportionate coverage gains.",
        venue: ["Undergraduate Thesis", "University of Waterloo"],
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
            acm: {
                label: "ACM Format",
                type: "paper",
            },
            project: {
                label: "Linked Project",
                type: "project",
            },
        },
    },

    "tumor-growth-dde": {
        title: "Relapse Thresholds in QCC Dormancy: A DDE Model for Tumor Growth",
        abstract:
            "Mathematical models are valuable tools for understanding tumor growth dynamics. This paper proposes a novel extension to an existing delay differential equation model that incorporates the immune system's response and a cell cycle-specific drug. The extended model distinguishes three key populations: proliferating tumor cells, dividing tumor cells (mitosis), and immune cells. The delay term accounts for the time spent by tumor cells in the interphase before entering mitosis. We analyze the model's stability using the argument principle and establish a theorem that links stability to the time delay. Furthermore, we demonstrate the potential for periodic solutions arising through Hopf bifurcations, explored both theoretically and numerically. The paper also addresses the rationale behind excluding the quiescent cancer cell population ($G_0$) from the base model and discusses the potential impact of their reactivation on tumor recurrence. This comprehensive approach provides a deeper understanding of the interplay between tumor growth, immune response, and cell cycle-specific drugs.",
        venue: ["Undergraduate Thesis", "University of Waterloo"],
        duration: {
            start: new Date("2024-04-01"),
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
        projectId: "tumor-growth-dde",
        links: {
            thesis: {
                label: "Thesis Format",
                type: "paper",
            },
            presentation: {
                label: "Presentation",
                type: "slides",
            },
        },
    }
};
