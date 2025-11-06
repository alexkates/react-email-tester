import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

export default function TeamInvitationEmail() {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>You've been invited to join the team</Preview>
        <Body className="bg-gray-100 py-10 font-sans">
          <Container className="mx-auto max-w-[480px] rounded-2xl bg-white p-10 shadow-sm">
            {/* Header */}
            <Section className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[12px] bg-black">
                <Text className="m-0 text-[20px] font-semibold text-white">
                  T
                </Text>
              </div>
              <Heading className="m-0 text-[24px] leading-8 font-semibold text-black">
                Team Invitation
              </Heading>
            </Section>

            {/* Main Content */}
            <Section className="mb-8">
              <Text className="m-0 mb-4 text-[16px] leading-6 text-gray-900">
                Hi there,
              </Text>
              <Text className="m-0 mb-6 text-[16px] leading-6 text-gray-700">
                Sarah has invited you to join <strong>the team</strong>. Accept
                this invitation to start collaborating with your team members.
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="mb-8 text-center">
              <Button
                href="https://yourapp.com/invite/abc123"
                className="box-border inline-block rounded-xl bg-black px-8 py-3 text-[16px] font-medium text-white no-underline"
              >
                Accept Invitation
              </Button>
            </Section>

            {/* Alternative Link */}
            <Section className="mb-8 text-center">
              <Text className="m-0 text-[14px] leading-5 text-gray-600">
                Or copy and paste this link in your browser:
              </Text>
              <Link
                href="https://yourapp.com/invite/abc123"
                className="text-[14px] break-all text-black underline"
              >
                https://yourapp.com/invite/abc123
              </Link>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-6">
              <Text className="m-0 text-center text-[12px] leading-4 text-gray-500">
                This invitation was sent by Sarah. If you weren't expecting this
                invitation, you can safely ignore this email.
              </Text>
            </Section>
          </Container>

          {/* Bottom Footer */}
          <Container className="mx-auto mt-6 max-w-[480px]">
            <Text className="m-0 text-center text-[12px] leading-4 text-gray-400">
              © 2025 Your Company Name. All rights reserved.
            </Text>
            <Text className="m-0 text-center text-[12px] leading-4 text-gray-400">
              123 Business Street, Philadelphia, PA 19103
            </Text>
            <Text className="m-0 text-center text-[12px] leading-4 text-gray-400">
              <Link href="#" className="text-gray-400 underline">
                Unsubscribe
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
