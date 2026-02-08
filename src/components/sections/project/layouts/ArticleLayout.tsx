"use client";

import { projectsData } from "@/data/projects";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkUnwrapImages from "remark-unwrap-images";
import rehypeSlug from "rehype-slug";
import { displayFont } from "@/lib/fonts";
import Link from "next/link";
import { FiGithub, FiExternalLink, FiCalendar, FiCpu, FiLink } from "react-icons/fi";
import ProjectsPageHeader from "@/components/sections/project/ProjectsPageHeader";
import Tag from "@/components/ui/Tag";
import { useEffect, useState } from "react";
import { visit } from "unist-util-visit"; // Import the visitor

interface ArticleLayoutProps {
    projectId: string;
    markdownContent: string;
}

// Custom Plugin to Number Images ---
function rehypeFigureIds() {
    return (tree: any) => {
        let count = 0;
        // Visit every 'element' node
        visit(tree, 'element', (node: any) => {
            // If it is an image, increment and tag it
            if (node.tagName === 'img') {
                count++;
                node.properties.id = `fig-${count}`;
            }
        });
    };
}

export default function ArticleLayout({ projectId, markdownContent }: ArticleLayoutProps) {
    const project = projectsData[projectId];
    const [titleVisible, setTitleVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const titleElement = document.getElementById("article-title");
            if (titleElement) {
                const rect = titleElement.getBoundingClientRect();
                setTitleVisible(rect.bottom < 0);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!project) return null;

    // Reusable component for generating the Header Link with Numbering
    const HeaderRenderer = ({ id, children, levelClassName }: { id?: string, children: React.ReactNode, levelClassName: string }) => (
        <a
            href={`#${id}`}
            className={`flex-1 !no-underline hover:text-primary transition-colors flex items-baseline gap-3 w-full text-foreground ${levelClassName}`}
        >
            {/* The CSS in globals.css targets this span to inject the number */}
            <span className="number-prefix font-mono text-primary/70 mr-1 select-none flex-shrink-0"></span>

            <span>{children}</span>

            <FiLink className="opacity-0 group-hover:opacity-50 transition-opacity text-[0.8em] text-muted-foreground self-center flex-shrink-0" />
        </a>
    );

    return (
        <div className="min-h-screen w-full bg-background text-foreground pb-20">
            <ProjectsPageHeader
                titleVisible={titleVisible}
                isLandscape={false}
            />

            <main className="max-w-6xl mx-auto px-6 pt-28 md:pt-32">

                {/* 1. Header Section */}
                <div id="article-title" className="mb-8">
                    <div className="flex items-center gap-3 text-primary mb-6">
                        <project.icon className="w-8 h-8" />
                        <span className="font-mono text-sm tracking-widest uppercase">{project.type} Project</span>
                    </div>
                    <h1 className={`${displayFont} text-4xl md:text-7xl font-normal mb-6 leading-[0.9]`}>
                        {project.name}
                    </h1>
                    {project.subtitle && (
                        <p className="text-xl md:text-3xl text-muted-foreground font-light leading-snug">
                            {project.subtitle}
                        </p>
                    )}
                </div>

                {/* 2. Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 border-y border-border/30 mb-16">
                    <div className="md:col-span-8 space-y-6">
                        <div>
                            <h3 className="text-xs font-mono uppercase text-muted-foreground mb-3 flex items-center gap-2">
                                <FiCpu /> Technologies Used
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack && Object.values(project.techStack).flat().map((tech) => (
                                    <Tag key={tech.name} text={tech.name} />
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm font-mono">
                            <FiCalendar />
                            <span>
                                Published: {project.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    </div>

                    <div className="md:col-span-4 flex flex-col gap-3">
                        <h3 className="text-xs font-mono uppercase text-muted-foreground mb-1">Resources</h3>
                        {project.links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                className="group flex items-center justify-between p-3 bg-secondary/20 border border-border/50 hover:border-primary transition-all duration-300 rounded shadow-sm !no-underline"
                            >
                                <span className="font-medium flex items-center gap-2 text-sm">
                                    {link.name}
                                </span>
                                {link.name.toLowerCase().includes("git")
                                    ? <FiGithub className="text-lg group-hover:scale-110 transition-transform" />
                                    : <FiExternalLink className="text-lg group-hover:scale-110 transition-transform" />
                                }
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 3. Article Content */}
                <article className="article-content prose prose-lg dark:prose-invert max-w-none 
                    prose-headings:scroll-mt-28 
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                    prose-img:shadow-lg prose-img:border prose-img:border-border/50
                ">
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm, remarkUnwrapImages]}
                        // 2. Add our custom plugin here!
                        rehypePlugins={[rehypeSlug, rehypeFigureIds]}
                        components={{
                            // Updated Image Renderer
                            img: ({node, ...props}) => {
                                const rawSrc = typeof props.src === 'string' ? props.src : "";
                                if (!rawSrc) return null;
                                
                                const src = rawSrc.startsWith('/') ? rawSrc : `/images/projects/${projectId}/${rawSrc}`;
                                const alt = props.alt || "Figure";
                                
                                // 3. Retrieve the ID injected by our plugin (e.g., 'fig-1')
                                const id = props.id || "fig-unknown"; 

                                return (
                                    <figure id={id} className="my-12 w-full group">
                                        <img 
                                            {...props} 
                                            src={src} 
                                            className="w-full h-auto rounded-none border border-border/40"
                                            alt={alt}
                                        />
                                        <figcaption className="text-center text-sm text-muted-foreground mt-3 italic flex justify-center">
                                            <a 
                                                href={`#${id}`} 
                                                className="!no-underline hover:text-primary transition-colors flex items-center gap-1.5"
                                            >
                                                {/* CSS Counter displays "Figure 1: " */}
                                                <span className="figure-prefix not-italic font-semibold text-foreground/80"></span>
                                                
                                                {/* The Alt Text */}
                                                <span>{alt}</span>
                                                
                                                {/* The Link Thingy */}
                                                <FiLink className="opacity-0 group-hover:opacity-100 transition-opacity text-xs" />
                                            </a>
                                        </figcaption>
                                    </figure>
                                );
                            },
                            // H1 (#)
                            h1: ({ node, ...props }) => (
                                <h1 id={props.id} className="group text-4xl font-normal mt-20 mb-8 border-b border-border/30 pb-4">
                                    <HeaderRenderer id={props.id} levelClassName="text-4xl">
                                        {props.children}
                                    </HeaderRenderer>
                                </h1>
                            ),
                            // H2 (##)
                            h2: ({ node, ...props }) => (
                                <h2 id={props.id} className="group text-3xl font-normal mt-16 mb-6 border-b border-border/30 pb-3">
                                    <HeaderRenderer id={props.id} levelClassName="text-3xl">
                                        {props.children}
                                    </HeaderRenderer>
                                </h2>
                            ),
                            // H3 (###)
                            h3: ({ node, ...props }) => (
                                <h3 id={props.id} className="group text-2xl font-normal mt-12 mb-4 border-b border-border/30 pb-2">
                                    <HeaderRenderer id={props.id} levelClassName="text-2xl">
                                        {props.children}
                                    </HeaderRenderer>
                                </h3>
                            ),
                            // H4 (####)
                            h4: ({ node, ...props }) => (
                                <h4 id={props.id} className="group text-xl font-normal mt-10 mb-4 border-b border-border/30 pb-2">
                                    <HeaderRenderer id={props.id} levelClassName="text-xl">
                                        {props.children}
                                    </HeaderRenderer>
                                </h4>
                            ),
                            // H5 (#####)
                            h5: ({ node, ...props }) => (
                                <h5 id={props.id} className="group text-lg font-normal mt-8 mb-3 border-b border-border/30 pb-2">
                                    <HeaderRenderer id={props.id} levelClassName="text-lg">
                                        {props.children}
                                    </HeaderRenderer>
                                </h5>
                            ),
                        }}
                    >
                        {markdownContent || "*No content available.*"}
                    </ReactMarkdown>
                </article>
            </main>
        </div>
    );
}
