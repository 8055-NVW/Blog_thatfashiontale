// src/emails/MagicLinkEmail.tsx
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";

interface MagicLinkEmailProps {
    magicLink?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const MagicLinkEmail = ({ magicLink }: MagicLinkEmailProps) => (
    <Html>
        <Head />
        <Preview>Log in with this magic link.</Preview>
        <Body style={main}>
            <Container style={container}>
                <Img
                    src={`${baseUrl}/logo.png`} // gotta put logo here
                    width={48}
                    height={48}
                    alt="ThatFashionTale"
                />
                <Heading style={heading}>🪄 Your magic link</Heading>
                <Section style={body}>
                    <Text style={paragraph}>
                        <Link style={link} href={magicLink}>
                            👉 Click here to sign in 👈
                        </Link>
                    </Text>
                    <Text style={paragraph}>
                        If you didn't request this, you can safely ignore it.
                    </Text>
                </Section>
                <Text style={paragraph}>
                    Best,<br />— The Dev Team
                </Text>
                <Hr style={hr} />
                <Text style={footer}>8055 Dev • London, United Kingdom</Text>
            </Container>
        </Body>
    </Html>
);

export default MagicLinkEmail;

const main = {
    backgroundColor: "#ffffff",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "20px 25px 48px",
};

const heading = {
    fontSize: "28px",
    fontWeight: "bold",
    marginTop: "48px",
};

const body = {
    margin: "24px 0",
};

const paragraph = {
    fontSize: "16px",
    lineHeight: "26px",
};

const link = {
    color: "#FF6363",
};

const hr = {
    borderColor: "#dddddd",
    marginTop: "48px",
};

const footer = {
    color: "#8898aa",
    fontSize: "12px",
    marginTop: "16px",
};
