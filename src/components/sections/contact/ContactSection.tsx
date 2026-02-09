"use client";

import Section from "@/components/ui/Section";
import SocialItems from "@/components/sections/contact/SocialItem";
import ContactForm from "@/components/sections/contact/ContactForm";
import { socials } from "@/data/contact";
import CaseGlitch from "@/components/ui/CaseGlitch";
import { displayFont } from "@/lib/fonts";

export default function ContactSection() {
    return (
        <Section
            id="contact"
            headerProps={{ title: "contAct" }}
            className="text-3xl md:text-4xl lg:text-4xl theme-bg theme-text"
        >
            <SocialItems socials={socials} className="text-3xl md:text-4xl lg:text-4xl"/>

            <CaseGlitch
                text="or buzz me right here."
                className={`${displayFont} my-14 md:my-20 text-center text-xl md:text-3xl lg:text-4xl`}
            />

            <ContactForm />
        </Section>
    );
}
