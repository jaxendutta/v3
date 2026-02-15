// src/data/projectData.ts
import { ProjectsData } from "@/types/project";
import { FaSpaceAwesome } from "react-icons/fa6";
import {
    GiBoltEye,
    GiBrainTentacle,
    GiBee,
    GiCardJoker,
    GiOrbital,
    GiNestedEclipses,
    GiAbstract014,
    GiPlagueDoctorProfile,
    GiJumpingDog,
} from "react-icons/gi";
import { AiOutlineFolderView } from "react-icons/ai";
import { PiCodesandboxLogoLight } from "react-icons/pi";

const calloutStyle =
    "border border-2 border-dashed py-2 px-2 md:px-4 mt-8";

export const projectsData: ProjectsData = {
    asher: {
        name: "AsHeR's GARden",
        icon: GiJumpingDog,
        type: "development",
        layoutType: "showcase",
        date: new Date("2025-05-20"),
        screenshotDevice: "mobile",
        overview: [
            [
                {
                    className: calloutStyle,
                    content: "A Garden of Scientific Discovery",
                },
                {
                    content:
                        'A nature-inspired research portfolio for Asher Kim, MSc Biology Candidate at the University of Ottawa. Titled "Asher\'s Garden," the site showcases their research with unique interactive animals.',
                },
            ],
            [
                {
                    className: calloutStyle,
                    content: "Where Science Meets Nature",
                },
                {
                    content:
                        "Built with Next.js 16 and React 19, the portfolio features a distinctive grass tile background, interactive research sections, and a playful duck mascot. The design bridges academic rigor with a warm, approachable visual identity.",
                },
            ],
        ],
        links: [
            {
                platform: "GitHub",
                url: "https://github.com/jaxendutta/asher",
            },
            {
                platform: "Live Site",
                url: "https://asher.anirban.ca",
            },
        ],
        typography: [
            {
                name: "Press Start 2P",
                fontFamily: '"Press Start 2P", cursive',
                url: "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap",
                description: "This definitive 8-bit font anchors the site's hero section. It establishes the retro-gaming aesthetic immediately, turning the portfolio header into a title screen for Asher's world.",
            },
            {
                name: "Jacquard 24",
                fontFamily: '"Jacquard 24", sans-serif',
                url: "https://fonts.googleapis.com/css2?family=Jacquard+24&display=swap",
                description: "With its intricate pixel definition, Jacquard 24 provides a decorative flourish for special accents and emphasis within the garden landscape, adding texture to the typographic hierarchy.",
            },
            {
                name: "Tiny5",
                fontFamily: '"Tiny5", sans-serif',
                url: "https://fonts.googleapis.com/css2?family=Tiny5&display=swap",
                description: "This compact 5px font is used for the 'Cat Chat' interactive bubbles and small UI details. It perfectly mimics the limited-resolution text found on vintage handheld gaming consoles.",
            },
            {
                name: "Jersey 25",
                fontFamily: '"Jersey 25", sans-serif',
                url: "https://fonts.googleapis.com/css2?family=Jersey+25&display=swap",
                description: "A softer, more legible pixel font used for the primary navigation and section headings. It bridges the gap between the blocky arcade aesthetic and the need for clear readability in menus.",
            },
        ],
        colors: [
            {
                palette: ["#18181b", "#fff7ed", "#1d4ed8", "#f43f5e", "#bef264"],
                description:
                    "This high-contrast content palette balances readability with vibrant energy. Deep zinc (#18181b) text rests comfortably on warm cream (#fff7ed) card backgrounds, mimicking organic paper. High-saturation accents—electric blue (#1d4ed8), rose (#f43f5e), and bright lime (#bef264)—are used for links, blooming interactions, and key highlights, popping sharply against the natural tones.",
            },
            {
                palette: ["#7ac755"],
                description:
                    "The signature grass green (#7ac755) serves as the page background and theme color, creating a natural, organic foundation that reinforces the 'garden' metaphor throughout the site.",
            },
        ],
        techStack: {
            Frontend: [
                { name: "Next.js", version: "16.1" },
                { name: "React", version: "19.4" },
                { name: "Tailwind", version: "4.1" },
                { name: "Framer Motion" },
                { name: "MDX" },
            ],
            Backend: [{ name: "Server Actions" }],
            Development: [{ name: "Vercel" }],
        },
        footer: "Asher Kim's Research Portfolio is a Next.js 16 application showcasing plant biology and molecular research. The site features a distinctive grass-tiled background that creates an immersive natural environment. With dark and light theme support, the portfolio presents research experience, publications, presentations, and outreach activities in an organized, accessible format. The design balances academic professionalism with a warm, approachable aesthetic that reflects Asher's research in plant-microbe interactions and stress responses. Interactive elements and smooth animations enhance user engagement while maintaining focus on scientific content.",
    },
    rgap: {
        name: "RGAp",
        icon: GiAbstract014,
        type: "development",
        layoutType: "showcase",
        date: new Date("2026-01-24"),
        screenshotDevice: "mobile",
        overview: [
            [
                {
                    className: calloutStyle,
                    content: "Democratizing Research Funding Data",
                },
                {
                    content:
                        "A powerful analytics platform that aggregates over 193,000 research grants from Canada's major funding agencies (NSERC, CIHR, SSHRC). It transforms raw data into actionable insights, helping researchers and institutions track funding trends and discover opportunities.",
                },
            ],
            [
                {
                    className: calloutStyle,
                    content: "Modern Engineering",
                },
                {
                    content:
                        "Rebuilt from the ground up using Next.js 16 and PostgreSQL 17 (initially MySQL) to deliver sub-second search speeds across millions of records. Features a robust user system with bookmarking, search history, and personalized analytics.",
                },
            ],
        ],
        links: [
            {
                platform: "GitHub",
                url: "https://github.com/jaxendutta/rgap-v2",
            },
            {
                platform: "Live Site",
                url: "https://rgap.anirban.ca",
            },
        ],
        typography: [
            {
                name: "Inter",
                fontFamily: '"Inter", sans-serif',
                url: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
                description:
                    "The industry standard for modern user interfaces, its high x-height and careful kerning ensure that complex data tables and analytics dashboards remain legible at any size, reducing cognitive load for researchers analyzing dense information.",
            },
            {
                name: "JetBrains Mono",
                fontFamily: '"JetBrains Mono", monospace',
                url: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap",
                description:
                    "JetBrains Mono is utilized for data visualization tooltips, code snippets, and grant reference numbers. Its increased character height and distinctive shapes improve readability for numerical data and technical identifiers.",
            },
        ],
        colors: [
            {
                palette: ["#0a0a0a", "#ededed", "#3b82f6", "#10b981"],
                description:
                    "The platform employs a strictly neutral monochrome foundation (#0a0a0a, #ededed) to let the data take center stage. Semantic colors are reserved strictly for data visualization: Blue (#3b82f6) for quantitative metrics and Emerald (#10b981) for financial indicators.",
            },
        ],
        techStack: {
            Frontend: [
                { name: "Next.js", version: "16.1" },
                { name: "React", version: "19.4" },
                { name: "Tailwind", version: "4.1" },
                { name: "Recharts" },
                { name: "TanStack Query" },
            ],
            Backend: [
                { name: "PostgreSQL", version: "17" },
                { name: "MySQL", version: "8.0.44" },
                { name: "Iron Session" },
            ],
            Deployment: [{ name: "Docker" }, { name: "Vercel" }, { name: "Supabase" }],
        },
        footer: "RGAP represents a complete modernization of legacy research tools. The architecture leverages Next.js 16's App Router and Server Components for optimal performance. I implemented a custom PostgreSQL schema with GIN indexes and fuzzy matching (pg_trgm) to enable instant search capabilities across hundreds of thousands of records. The frontend utilizes React 19 features and a custom-built component library styled with Tailwind 4.1, ensuring a consistent and accessible experience. Security is handled via stateless Iron Sessions and bcrypt hashing, providing a secure environment for researchers to manage their grants and bookmarks.",
    },
    pvc: {
        name: "pARkVieW centRe",
        icon: GiPlagueDoctorProfile,
        type: "development",
        layoutType: "showcase",
        date: new Date("2025-11-10"),
        screenshotDevice: "mobile",
        overview: [
            [
                {
                    className: calloutStyle,
                    content: "Healthcare, Modernized",
                },
                {
                    content:
                        "A comprehensive digital platform for Park View Centre, a premier polyclinic in Kolkata. The site serves as a bridge between patients and specialized care, featuring Dr. Chanda Chowdhury and Dr. Sumon Dutta.",
                },
            ],
            [
                {
                    className: calloutStyle,
                    content: "Trust by Design",
                },
                {
                    content:
                        "Built with the bleeding-edge Next.js 16 and Tailwind 4, the platform prioritizes accessibility and trust. It features seamless appointment booking, multi-location management, and a soothing, professional interface that puts patient needs first.",
                },
            ],
        ],
        links: [
            {
                platform: "GitHub",
                url: "https://github.com/jaxendutta/pvc",
            },
            {
                platform: "Live Site",
                url: "https://parkviewcentre.in",
            },
        ],
        typography: [
            {
                name: "Montserrat",
                fontFamily: '"Montserrat", sans-serif',
                url: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400..700&display=swap",
                description:
                    "Montserrat is a geometric sans-serif typeface that balances modern professionalism with approachability. Its clean lines and high legibility make it ideal for medical information, instilling a sense of clarity and clinical precision.",
            },
        ],
        colors: [
            {
                palette: ["#FFFFFF", "#0066CC", "#00A86B", "#F5F5F5"],
                description:
                    "The palette is strictly clinical yet welcoming. Clinical White (#FFFFFF) and Soft Gray (#F5F5F5) provide a sterile, clean background. Primary Blue (#0066CC) anchors the brand with a sense of trust and stability, while the Vitality Green (#00A86B) accent emphasizes healing and well-being.",
            },
        ],
        techStack: {
            Frontend: [
                { name: "Next.js", version: "16.1" },
                { name: "React", version: "19.2" },
                { name: "Tailwind", version: "4.0" },
                { name: "Radix UI" },
            ],
            Analytics: [{ name: "Vercel Analytics" }],
            Deployment: [{ name: "Vercel" }],
        },
        footer: "Park View Centre is a production-grade healthcare platform built on the latest Next.js 16 architecture. I utilized Tailwind CSS v4 for a highly optimized, zero-runtime styling engine that ensures instant page loads. The UI is constructed with accessible Radix primitives, ensuring that appointment booking and doctor information are available to all users. The site uses a custom 'medical gradient' animation system to add subtle life to the interface without distracting from critical information. It is fully integrated with Vercel Analytics to track patient engagement and optimize the user journey across both clinic locations.",
    },
    "portfolio-v2": {
        name: "poRtfolio v2",
        icon: GiOrbital,
        type: "development",
        layoutType: "showcase",
        date: new Date("2025-04-10"),
        screenshotDevice: "mobile",
        overview: [
            [
                {
                    className: calloutStyle,
                    content: "Same Vision, Cutting-Edge Tech",
                },
                {
                    content:
                        "This portfolio revamp preserves the original's style while upgrading to Next.js 15, React 19, and Tailwind 4.1. Modern architecture with the same visual impact, but significantly faster performance.",
                },
            ],
            [
                {
                    className: calloutStyle,
                    content: "Effortless Interactivity",
                },
                {
                    content:
                        "React Server Components and App Router power seamless navigation, while Framer Motion delivers smooth animations with minimal code. A perfect showcase of modern web development that just feels right.",
                },
            ],
        ],
        links: [
            {
                platform: "GitHub",
                url: "https://github.com/jaxendutta/portfolio-v2",
            },
            {
                platform: "Live Site",
                url: "https://v2.anirban.ca",
            },
        ],
        typography: [
            {
                name: "Major Mono Display",
                fontFamily: '"Major Mono Display", monospace',
                url: "https://fonts.googleapis.com/css2?family=Major+Mono+Display&display=swap",
                description:
                    "Major Mono Display serves as the primary heading font, providing a distinctive, technical aesthetic that reflects my background in software development. Its monospaced, geometric design evokes a sense of precision and digital craftsmanship.",
            },
            {
                name: "Fira Code",
                fontFamily: '"Fira Code", monospace',
                url: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap",
                description:
                    "Fira Code, with its developer-friendly ligatures and clean appearance, is used for code snippets and technical content. This font enhances readability while maintaining the site's modern, technical aesthetic.",
            },
        ],
        colors: [
            {
                palette: ["#17181C", "#F4F1EA", "#D7482F", "#DEEFB7"],
                description:
                    "The dark theme features a deep charcoal background (#17181C) with warm off-white text (#F4F1EA), creating strong contrast for readability. Vibrant red (#D7482F) accents add energy while soft lime (#DEEFB7) highlights create visual interest.",
            },
            {
                palette: ["#F4F1EA", "#001ECB", "#28B7D0", "#001ECB"],
                description:
                    "The light theme employs a warm off-white background (#F4F1EA) with deep blue text (#001ECB) for comfortable reading. Bright teal accents (#28B7D0) provide visual interest without sacrificing accessibility.",
            },
        ],
        techStack: {
            Frontend: [
                { name: "Next.js", version: "16.1" },
                { name: "React", version: "19.4" },
                { name: "Tailwind", version: "4.1" },
                { name: "Framer Motion" },
            ],
            Backend: [{ name: "Server Actions" }],
            Development: [{ name: "Vercel" }],
        },
        footer: "This portfolio revamp is built with Next.js 15 and React 19, preserving the visual identity of v1 while adding significant technical improvements. The implementation uses a hybrid rendering strategy with Server Components for static content and Client Components for interactive elements. For styling, I leveraged Tailwind 4.1 with custom design tokens that maintain the original color scheme while enabling the theme switching with zero flicker. The contact form uses React Server Actions with zod validation and the Resend API for email delivery. All animations were recreated using Framer Motion, reducing animation code by 70% while maintaining the same visual effects. Image loading is optimized through Next.js Image component with proper sizing, formats, and lazy loading. The site is fully accessible with perfect Lighthouse scores and 100% keyboard navigability. Analytics and performance monitoring are implemented using Vercel's built-in tools.",
    },

    "evse-opt": {
        name: "eVse",
        subtitle: "netWoRk optiMiZeR",
        icon: GiBoltEye,
        type: "research",
        layoutType: "article",
        date: new Date("2024-12-18"),
        screenshotDevice: "mobile",
        links: [
            {
                platform: "GitHub",
                url: "https://github.com/jaxendutta/kwc-ev-charging-network-opt",
            },
        ],
        techStack: {
            "Data Engineering": [
                { name: "Python" },
                { name: "GeoPandas" },
                { name: "GIS" },
            ],
            "Visualization": [{ name: "Folium" }],
            Optimization: [{ name: "Gurobi" }],
        },
    },

    fabler: {
        name: "fAbleR",
        icon: GiBrainTentacle,
        type: "design",
        layoutType: "showcase",
        date: new Date("2024-08-18"),
        screenshotDevice: "mobile",
        overview: [
            [
                {
                    className: calloutStyle,
                    content: "Tired of Generic Visual Novels?",
                },
                {
                    content:
                        "Imagine crafting your own story, a world where every narrative unfolds based on your desires. Fabler empowers you to be the author.",
                },
            ],
            [
                { className: calloutStyle, content: "But how does it work?" },
                {
                    content:
                        "Fabler leverages the magic of AI! Simply provide a prompt - a spark of inspiration - and our intelligent system weaves a captivating visual novel tailored to your vision.",
                },
            ],
        ],
        links: [
            {
                platform: "GitHub",
                url: "https://github.com/SE2-Fabler/",
            },
            {
                platform: "Figma",
                url: "https://www.figma.com/proto/kjrv7xO5wJAFPIJFyd4uy4/Fabler?scaling=scale-down",
            },
        ],
        typography: [
            {
                name: "Roboto Flex",
                fontFamily: '"Roboto Flex", sans-serif',
                url: "https://fonts.googleapis.com/css2?family=Roboto+Flex:wght@100...900&display=swap",
                description:
                    "Roboto Flex was chosen for its clean and modern aesthetic, which aligns with the app's focus on user-generated content. Its versatility allows for adaptation to various screen sizes and contexts. The consistent use of Roboto Flex throughout the app creates a cohesive and recognizable visual identity.",
            },
            {
                name: "Italiana",
                fontFamily: '"Italiana", sans-serif',
                url: "https://fonts.googleapis.com/css2?family=Italiana&display=swap",
                description:
                    "The Italiana font, with its elegant serifs and subtle contrast, evokes a sense of timeless storytelling perfect for visual novels. Its graceful letterforms harken back to classic literature and fairy tales, creating a fable-like atmosphere.",
            },
        ],
        colors: [
            {
                palette: ["#A35E1E", "#EAD8D0", "#F8E6D0"],
                description:
                    "Fabler's visual identity is characterized by a clean and minimalist aesthetic. The color palette of A35E1E, F8E6D0, and EAD8D0 creates a warm and inviting atmosphere.",
            },
            {
                palette: [
                    "#8B4513",
                    "#4682B4",
                    "#228B22",
                    "#B8860B",
                    "#CD5C5C",
                ],
                description:
                    "Secondary color palette: These colors complement the primary palette and are used in the visual novel elements while generation for accents, backgrounds, and other supporting elements.",
            },
        ],
        techStack: {
            Frontend: [
                { name: "Kotlin" },
                { name: "Jetpack Compose" },
                { name: "Android SDK" }],
            Backend: [
                { name: "Python" },
                { name: "Ren'Py" },
                { name: "FastAPI" }],
            "AI/ML": [
                { name: "OpenAI" },
                { name: "Stable Diffusion" }],
            Design: [
                { name: "Figma" },
                { name: "Material Design" },
                { name: "Miro" }],
        },
        footer: "In a large-scale Android visual novel app project, I led development using Jetpack Compose (Kotlin) for the frontend and a Python backend. I spearheaded design and prototyping through Figma and user interviews, ensuring a user-friendly experience. The app features a responsive UI with custom components adhering to Material Design and leverages the OpenAI API to generate storylines and character profiles directly within the visual novels.",
    },

    "portfolio-v1": {
        name: "poRtfolio v1",
        icon: GiNestedEclipses,
        type: "development",
        layoutType: "showcase",
        date: new Date("2023-12-22"),
        screenshotDevice: "mobile",
        overview: [
            [
                {
                    className: calloutStyle,
                    content: "Pure Web Craftsmanship",
                },
                {
                    content:
                        "Crafted solely with HTML5, CSS3, and minimal vanilla JavaScript, this site proves you don't need frameworks for stunning web experiences. Sleek animations and responsive design with zero dependencies.",
                },
            ],
            [
                {
                    className: calloutStyle,
                    content: "Less Code, More Impact",
                },
                {
                    content:
                        "Custom cursor effects, theme switching, and smooth animations - all implemented with under 1KB of hand-written JavaScript. Lightning-fast load times with perfect Lighthouse scores. Sometimes less truly is more.",
                },
            ],
        ],
        links: [
            {
                platform: "GitHub",
                url: "https://github.com/jaxendutta/portfolio",
            },
            {
                platform: "Live Site",
                url: "https://v1.anirban.ca",
            },
        ],
        typography: [
            {
                name: "Major Mono Display",
                fontFamily: '"Major Mono Display", monospace',
                url: "https://fonts.googleapis.com/css2?family=Major+Mono+Display&display=swap",
                description:
                    "Major Mono Display provides a distinctive, technical aesthetic for headings and titles. Its monospaced characters and unique uppercase/lowercase mixing creates visual interest throughout the site.",
            },
            {
                name: "Fira Code",
                fontFamily: '"Fira Code", monospace',
                url: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap",
                description:
                    "Fira Code offers excellent readability for body text while maintaining the technical theme of the portfolio. Its subtle programming ligatures add a developer-focused touch to the content.",
            },
        ],
        colors: [
            {
                palette: ["#17181C", "#F4F1EA", "#D7482F", "#DEEFB7"],
                description:
                    "The color scheme balances readability with visual impact. Dark backgrounds with high-contrast text ensure content legibility, while accent colors add personality and highlight interactive elements.",
            },
        ],
        techStack: {
            Frontend: [
                { name: "HTML" },
                { name: "CSS" },
                { name: "JavaScript" }],
            Deployment: [{ name: "Netlify" }],
        },
        footer: "My original portfolio was crafted with vanilla JavaScript, HTML5, and CSS3 to demonstrate core web development fundamentals without relying on frameworks. I implemented custom scroll-triggered animations, a dynamic theme switcher using CSS variables, and interactive project cards with pure CSS transitions. The site features a custom-built content loader that dynamically fetches project data without any libraries. For animations, I created a custom timeline system in just 30 lines of JavaScript that handles scroll-based triggers and easing functions. The entire site loads in under 500ms, achieving perfect 100 scores across all Lighthouse metrics. This project showcases the power of mastering fundamentals and proves that impressive interactions don't always require heavy frameworks.",
    },

    hivemind: {
        name: "HiVeMind",
        icon: GiBee,
        date: new Date("2023-08-18"),
        screenshotDevice: "mobile",
        type: "design",
        layoutType: "showcase",
        overview: [
            [
                {
                    className: calloutStyle,
                    content: "Collaborative Learning, Reimagined.",
                },
                {
                    content:
                        "Hivemind connects students worldwide, fostering a vibrant ecosystem of shared knowledge and collaborative study groups. Break free from isolation and tap into the power of collective intelligence.",
                },
            ],
            [
                { className: calloutStyle, content: "How does it work?" },
                {
                    content:
                        "Our innovative platform uses smart matching algorithms to connect you with like-minded learners, creating the perfect study environment tailored to your needs and learning style. From instant study sessions to long-term project collaborations, Hivemind adapts to your academic journey.",
                },
            ],
        ],
        links: [
            {
                platform: "Figma",
                url: "https://www.figma.com/proto/OgAWcQHH2BAl2djJTCnHII/Hivemind?scaling=scale-down",
            },
            {
                platform: "Case Study",
                url: "https://docs.google.com/document/d/1mqnpwIP3gOAwz9jm2UrgXZnNPSO40aCmM-wA7pEuu2Q/view",
            },
        ],
        typography: [
            {
                name: "M PLUS Rounded 1c",
                fontFamily: '"M PLUS Rounded 1c", sans-serif',
                url: "https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c&display=swap",
                description:
                    "Rounded Mplus 1c Bold is used for larger text elements, embodying the app's friendly nature. Its rounded edges and bold weight create a welcoming atmosphere, reinforcing the app's collaborative spirit and adding a touch of playfulness to the interface.",
            },
            {
                name: "Noto Sans",
                fontFamily: '"Noto Sans", sans-serif',
                url: "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap",
                description:
                    "Noto Sans was selected for its clean, modern look and excellent readability across devices. Its neutral yet friendly appearance aligns with Hivemind's inclusive learning environment, ensuring users can easily engage with content and reducing cognitive load during study sessions.",
            },
        ],
        colors: [
            {
                palette: ["#151413", "#FFA800", "#EEDBB7", "#F0F0F0"],
                description:
                    "The primary color palette of Hivemind is inspired by the natural world of bees and hives. The vibrant #FFA800 represents the energy and vitality of honey, while #EEDBB7 provides a softer, complementary tone reminiscent of beeswax. Dark #151413 offers strong contrast for text, while #F0F0F0 ensures readability.",
            },
            {
                palette: ["#FF6633", "#00B383", "#0071C1", "#6D29F6"],
                description:
                    "The secondary color palette introduces additional vibrancy and functionality to the app. These colors work together to create a diverse yet harmonious visual experience that supports various UI elements and user interactions.",
            },
        ],
        techStack: {
            Design: [
                { name: "Figma" },
                { name: "Miro" }],
        },
        footer: "As the lead of Hivemind, a collaborative study app project, I directed the design and iOS prototype development efforts. Working with a diverse team, I facilitated Figma prototyping and conducted user interviews, refining the user experience. The app promotes seamless online connections for students worldwide, fostering collaborative study groups.",
    },

    "space-invaders": {
        name: "spAce inVAdeRs",
        icon: FaSpaceAwesome,
        type: "development",
        layoutType: "showcase",
        date: new Date("2023-08-18"),
        overview: [
            [
                {
                    className: calloutStyle,
                    content: "Retro Gaming Reimagined",
                },
                {
                    content:
                        "Dive into nostalgia with a modern twist! This Space Invaders remake brings the classic arcade experience to your desktop, powered by cutting-edge Kotlin and JavaFX technologies.",
                },
            ],
            [
                {
                    className: calloutStyle,
                    content: "Challenge the Alien Invasion",
                },
                {
                    content:
                        "Test your reflexes and strategy as you defend Earth from waves of descending aliens. With each level, the challenge intensifies, keeping you on the edge of your seat!",
                },
            ],
        ],
        links: [
            {
                platform: "GitHub",
                url: "https://github.com/jaxendutta/space-invaders/",
            },
            {
                platform: "Download",
                url: "https://github.com/jaxendutta/space-invaders/releases",
            },
        ],
        typography: [
            {
                name: "Press Start 2P",
                fontFamily: '"Press Start 2P", cursive',
                url: "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap",
                description:
                    "Press Start 2P is a bitmap font based on the font design from 1980s Namco arcade games. It perfectly captures the retro feel of classic space shooter games, enhancing the authentic arcade experience.",
            },
            {
                name: "Lucida Console",
                fontFamily: '"Lucida Console", monospace',
                url: "https://fonts.googleapis.com/css2?family=Lucida+Console&display=swap",
                description:
                    "Lucida Console, a monospaced font, is used for displaying game information and instructions. Its clear, easy-to-read design ensures that players can quickly understand the game mechanics and progress through the levels.",
            },
        ],
        colors: [
            {
                palette: ["#00FF00", "#FF00FF", "#FFFFFF", "#000000"],
                description:
                    "The color scheme pays homage to classic arcade games. Bright green (#00FF00) and magenta (#FF00FF) create a vibrant, retro feel against the stark contrast of white (#FFFFFF) and black (#000000), mimicking early CRT displays.",
            },
        ],
        techStack: {
            Frontend: [
                { name: "Kotlin" },
                { name: "JavaFX" }],
            "Build Tools": [
                { name: "Gradle" }],
        },
        footer: "Created with Kotlin and JavaFX, this game features a visually engaging interface with a title screen, player-controlled ship, and dynamically moving alien fleet. Multiple levels were implemented, each intensifying the challenge as the player progresses. The use of smooth animations and audio feedback enhances the overall gaming atmosphere, showcasing elements of game development and animation techniques.",
    },

    "file-explorer": {
        name: "file eXploReR",
        icon: AiOutlineFolderView,
        type: "development",
        layoutType: "showcase",
        date: new Date("2023-08-18"),
        overview: [
            [
                {
                    className: calloutStyle,
                    content: "Streamlined File Management",
                },
                {
                    content:
                        "Experience a modern, intuitive file management solution built with Kotlin and JavaFX. Navigate your digital world with ease and efficiency.",
                },
            ],
            [
                {
                    className: calloutStyle,
                    content: "Feature-Rich Interface",
                },
                {
                    content:
                        "From creating folders to previewing files, our File Explorer puts powerful tools at your fingertips. Enjoy a seamless, user-friendly experience for all your file organization needs.",
                },
            ],
        ],
        links: [
            {
                platform: "GitHub",
                url: "https://github.com/jaxendutta/file-explorer/",
            },
            {
                platform: "Download",
                url: "https://github.com/jaxendutta/file-explorer/releases",
            },
        ],
        typography: [
            {
                name: "Noto Sans",
                fontFamily: '"Noto Sans", sans-serif',
                url: "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap",
                description:
                    "Noto Sans was chosen for its clean, modern look and excellent readability across devices. Its neutral yet friendly appearance aligns with File Explorer's focus on user-friendly file management, ensuring users can easily navigate the interface and access file manipulation options.",
            },
        ],
        colors: [
            {
                palette: [
                    "#2196F3",
                    "#BBDEFB",
                    "#FFFFFF",
                    "#757575",
                    "#212121",
                ],
                description:
                    "The color scheme is designed for clarity and ease of use. The primary blue (#2196F3) highlights interactive elements, while lighter blue (#BBDEFB) subtly marks selections. White (#FFFFFF) backgrounds ensure readability, with dark gray (#212121) for text and medium gray (#757575) for secondary information.",
            },
        ],
        techStack: {
            Frontend: [
                { name: "Kotlin" },
                { name: "JavaFX" }],
            "Build Tools": [{ name: "Gradle" }],
            "File System": [{ name: "Java NIO" }],
        },
        footer: "File Explorer features a comprehensive Menu Bar with options for creating folders, opening directories, and exiting the program. The Actions menu empowers users to rename, move, and delete selected files effortlessly. A versatile Tool Bar provides quick access to navigation and file manipulation options. The main File View displays a clear hierarchy of files and directories, complemented by a preview panel for supported file types.",
    },

    lightbox: {
        name: "liGHtboX",
        icon: PiCodesandboxLogoLight,
        type: "development",
        layoutType: "showcase",
        date: new Date("2023-08-18"),
        overview: [
            [
                {
                    className: calloutStyle,
                    content: "Illuminate Your Images",
                },
                {
                    content:
                        "Discover Lightbox, a powerful image manipulation tool crafted with Kotlin and JavaFX. Transform your visual content with ease and precision.",
                },
            ],
            [
                {
                    className: calloutStyle,
                    content: "Intuitive Image Management",
                },
                {
                    content:
                        "From basic edits to advanced manipulations, Lightbox puts a suite of tools at your fingertips. Experience smooth, responsive image handling in a user-friendly interface.",
                },
            ],
        ],
        links: [
            {
                platform: "GitHub",
                url: "https://github.com/jaxendutta/lightbox/",
            },
            {
                platform: "Download",
                url: "https://github.com/jaxendutta/lightbox/releases",
            },
        ],
        typography: [
            {
                name: "Noto Sans",
                fontFamily: '"Noto Sans", sans-serif',
                url: "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap",
                description:
                    "Noto Sans was chosen for its clean, modern look and excellent readability across devices. Its neutral yet friendly appearance aligns with Lightbox's focus on user-friendly image editing, ensuring users can easily navigate the interface and access editing tools.",
            },
        ],
        colors: [
            {
                palette: [
                    "#3498db",
                    "#ecf0f1",
                    "#34495e",
                    "#2c3e50",
                    "#bdc3c7",
                ],
                description:
                    "The color scheme is designed for a clean, professional look. The primary blue (#3498db) highlights interactive elements, while light gray (#ecf0f1) provides a neutral background that doesn't interfere with image viewing. Dark blues (#34495e, #2c3e50) are used for text and UI accents, with medium gray (#bdc3c7) for secondary elements, creating a balanced and visually appealing interface.",
            },
        ],
        techStack: {
            Frontend: [
                { name: "Kotlin" }, { name: "JavaFX" }],
            "Build Tools": [{ name: "Gradle" }],
            "Image Processing": [{ name: "JavaFX Image API" }],
        },
        footer: "Lightbox showcases a feature-rich Tool Bar equipped with various buttons for comprehensive image manipulation. Users can effortlessly add, delete, rotate, and zoom images, among other operations. The heart of the application, the Preview Pane, offers intuitive image selection, dragging, and stacking capabilities, providing a seamless workflow for managing multiple images.",
    },

    straights: {
        name: "stRAiGHts",
        icon: GiCardJoker,
        type: "development",
        layoutType: "showcase",
        date: new Date("2022-08-18"),
        overview: [
            [
                {
                    className: calloutStyle,
                    content: "From Terminal to Web: A Card Game Transformation",
                },
                {
                    content:
                        "Experience Straights, a classic card game reimagined for the modern web. Originally a C++ terminal game, now playable in your browser thanks to the power of WebAssembly.",
                },
            ],
            [
                {
                    className: calloutStyle,
                    content: "Strategic 4-Player Action",
                },
                {
                    content:
                        "Dive into this engaging 4-player card game where strategy is key. Aim for the lowest score as you navigate through each round, making calculated moves to outplay your opponents.",
                },
            ],
        ],
        links: [
            {
                platform: "GitHub",
                url: "https://github.com/jaxendutta/straights/",
            },
            {
                platform: "Play",
                url: "https://dutta.itch.io/straights/",
            },
        ],
        typography: [
            {
                name: "Courier Prime",
                fontFamily: '"Courier Prime", monospace',
                url: "https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap",
                description:
                    "Courier Prime, a monospaced font, is reminiscent of classic terminal displays. Its clean, typewriter-style design enhances the retro feel of the game, paying homage to the original C++ version.",
            },
        ],
        colors: [
            {
                palette: ["#000000", "#FFFFFF", "#4A752C", "#B31B1B"],
                description:
                    "Straights pays homage to its terminal roots with a classic black (#000000) and white (#FFFFFF) color scheme, while adding card table green (#4A752C) and accent red (#B31B1B) for visual interest. The stark contrast between these colors creates a visually striking interface that is reminiscent of traditional card games while remaining accessible.",
            },
        ],
        techStack: {
            Backend: [
                { name: "C++" },
                { name: "WebAssembly" },
                { name: "Emscripten" }],
            Frontend: [
                { name: "HTML" },
                { name: "CSS" },
                { name: "JavaScript" }],
        },
        footer: "Straights showcases the seamless integration of C++ and web technologies. The core game logic, originally written in C++, has been recompiled to WebAssembly using Emscripten. This WebAssembly module is then integrated into a modern web application, with HTML, CSS, and JavaScript working in harmony to render the game state and provide an interactive user interface.",
    },
};
