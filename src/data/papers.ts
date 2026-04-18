// src/data/papers.ts
import { PapersData } from "@/types/paper";

export const papersData: PapersData = {
    emma: {
        title: "EMMA: Emergency Medicine Mentoring Agent",
        abstract:
            "This thesis presents EMMA (Emergency Medicine Mentoring Agent), a retrieval-augmented generation system designed to answer medical licensing examination questions. EMMA combines named entity recognition, unsupervised topic clustering via BERTopic, specialty classification, and FAISS-based dense retrieval to route questions to the most relevant context before invoking a large language model for explanation generation. The system is evaluated on the MedQA benchmark, demonstrating that deterministic, auditable routing components can substantially improve retrieval precision without sacrificing interpretability. Ablation studies isolate the contribution of each pipeline stage, and error analysis reveals systematic failure modes tied to ambiguous clinical terminology and cross-specialty overlap.",
        venue: ["Research Project", "University of Ottawa"],
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

    "evse-opt": {
        title: "EVSE Network Optimization in the KWC CMA",
        abstract:
            "This report formulates and solves a mixed-integer programming model for the optimal placement and capacity allocation of electric vehicle (EV) charging stations across the Region of Waterloo, Ontario. The model jointly minimizes total infrastructure cost while maximizing coverage of EV-owning households and transit nodes, subject to grid capacity constraints and minimum port requirements. A multi-phase implementation plan is derived from the optimization output, prioritizing Level 2 to Level 3 upgrades at high-demand sites before greenfield Level 3 deployment. Sensitivity analysis reveals that budget constraints are the binding bottleneck, and that targeted grid upgrades yield disproportionate coverage gains.",
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
};
