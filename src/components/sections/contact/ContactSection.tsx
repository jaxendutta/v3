"use client";

import Section from "@/components/ui/Section";
import SocialItems from "@/components/sections/contact/SocialItem";
import ContactForm from "@/components/sections/contact/ContactForm";
import { socials } from "@/data/contactData";
import CaseGlitch from "@/components/ui/CaseGlitch";
import { displayFont } from "@/lib/fonts";

export default function ContactSection() {
    return (
        <Section
            headerProps={{ title: "CONTACT" }}
            className="text-3xl md:text-4xl lg:text-4xl theme-bg theme-text"
        >
            <SocialItems socials={socials} />

            <CaseGlitch
                text="or buzz me right here."
                className={`${displayFont}`}
            />

            <ContactForm />
        </Section>
    );
}
