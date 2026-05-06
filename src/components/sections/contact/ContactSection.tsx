"use client";

import Section from "@/components/ui/Section";
import SocialItems from "@/components/sections/contact/SocialItem";
import ContactForm from "@/components/sections/contact/ContactForm";
import { socials } from "@/data/contact";
import { displayFont, serifFont } from "@/lib/fonts";

export default function ContactSection() {
    return (
        <Section
            id="contact"
            headerProps={{ title: "contAct" }}
            className="text-3xl md:text-4xl lg:text-4xl theme-bg theme-text"
        >
            <SocialItems socials={socials} className="text-3xl md:text-4xl lg:text-4xl" />

            <div className="my-12 md:my-16 flex items-center gap-3 md:gap-6 text-border">
                <span className="h-px flex-1 bg-border/70" />
                <span
                    className={`${serifFont} text-center text-lg md:text-2xl lg:text-3xl leading-none tracking-wide italic`}
                >
                    or
                </span>
                <span className="h-px flex-1 bg-border/70" />
            </div>

            <ContactForm />
        </Section>
    );
}
