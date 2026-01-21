// src/components/emails/ContactEmail.tsx
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";

interface ContactEmailProps {
    name: string;
    email: string;
    linkedin?: string;
    message: string;
    date: string;
}

export const ContactEmail = ({
    name,
    email,
    linkedin,
    message,
    date,
}: ContactEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>New portfolio contact from {name}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={heading}>
                        Portfolio v2: New Contact Form Submission
                    </Heading>

                    <Section style={infoSection}>
                        <Text style={infoHeader}>Contact Details</Text>
                        <Text style={infoItem}>
                            <strong>Name:</strong> {name}
                        </Text>
                        <Text style={infoItem}>
                            <strong>Email:</strong>{" "}
                            <Link href={`mailto:${email}`} style={link}>
                                {email}
                            </Link>
                        </Text>
                        {linkedin && (
                            <Text style={infoItem}>
                                <strong>LinkedIn:</strong>{" "}
                                <Link href={linkedin} style={link}>
                                    {linkedin.replace(
                                        /https:\/\/(www\.)?linkedin\.com\/in\//,
                                        ""
                                    )}
                                </Link>
                            </Text>
                        )}
                        <Text style={infoItem}>
                            <strong>Submitted on:</strong> {date}
                        </Text>
                    </Section>

                    <Hr style={hr} />

                    <Section style={messageSection}>
                        <Text style={messageHeader}>Message:</Text>
                        <Text style={messageText}>{message}</Text>
                    </Section>

                    <Hr style={hr} />

                    <Section style={actionSection}>
                        <Button style={actionButton} href={`mailto:${email}`}>
                            Reply to {name}
                        </Button>
                    </Section>

                    <Hr style={hr} />

                    <Text style={footer}>
                        This message was sent from the contact form on{" "}
                        <Link href={"https://v2.anirban.ca"} style={link}>
                            Portfolio v2
                        </Link>
                        .
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

// Styling for the email
const main = {
    backgroundColor: "#f5f5f5",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: "20px 0",
};

const container = {
    margin: "0 auto",
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    maxWidth: "600px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
};

const heading = {
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center" as const,
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: "20px",
};

const infoSection = {
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
};

const infoHeader = {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#444",
};

const infoItem = {
    fontSize: "16px",
    lineHeight: "24px",
    margin: "8px 0",
    color: "#333",
};

const messageSection = {
    marginBottom: "20px",
    padding: "15px",
};

const messageHeader = {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#444",
};

const messageText = {
    fontSize: "16px",
    lineHeight: "26px",
    color: "#333",
    whiteSpace: "pre-wrap" as const,
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    borderLeft: "4px solid #3182ce",
};

const actionSection = {
    marginBottom: "20px",
    textAlign: "center" as const,
};

const actionButton = {
    backgroundColor: "#3182ce",
    color: "#ffffff",
    borderRadius: "6px",
    fontWeight: "bold",
    padding: "12px 24px",
    textDecoration: "none",
    textAlign: "center" as const,
    fontSize: "16px",
};

const link = {
    color: "#3182ce",
    textDecoration: "underline",
};

const hr = {
    borderColor: "#e0e0e0",
    margin: "20px 0",
};

const footer = {
    fontSize: "14px",
    color: "#888",
    textAlign: "center" as const,
    margin: "20px 0 0 0",
};

export default ContactEmail;
