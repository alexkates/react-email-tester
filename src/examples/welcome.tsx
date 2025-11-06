import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

export default function WelcomeEmail() {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Welcome to our platform! Let's get you started.</Preview>
        <Body className="bg-gray-100 py-10 font-sans">
          <Container className="mx-auto max-w-[600px] rounded-xl bg-white px-8 py-10">
            <Section>
              <Heading className="mb-6 text-center text-[32px] font-bold text-gray-900">
                Welcome aboard! 🎉
              </Heading>

              <Text className="mb-6 text-[16px] leading-6 text-gray-700">
                Thank you for joining our platform! We're thrilled to have you
                as part of our community and can't wait to help you get the most
                out of your experience.
              </Text>

              <Text className="mb-8 text-[16px] leading-6 text-gray-700">
                To unlock all the amazing features we have in store for you,
                let's complete your account setup. It only takes a few minutes
                and you'll be ready to go!
              </Text>

              <Section className="mb-8 text-center">
                <Button
                  href="https://example.com/setup"
                  className="box-border inline-block rounded-[6px] bg-blue-600 px-8 py-3 text-[16px] font-semibold text-white no-underline"
                >
                  Complete Setup
                </Button>
              </Section>

              <Text className="mb-6 text-[14px] leading-5 text-gray-600">
                If you have any questions or need assistance, our support team
                is here to help. Simply reply to this email or visit our help
                center.
              </Text>

              <Text className="mb-8 text-[14px] leading-5 text-gray-600">
                Thanks again for choosing us. We're excited to see what you'll
                accomplish!
              </Text>

              <Text className="text-[14px] leading-5 text-gray-600">
                Best regards,
                <br />
                The Team
              </Text>
            </Section>

            <Section className="mt-8 border-t border-gray-200 pt-6">
              <Text className="m-0 mb-2 text-center text-[12px] text-gray-500">
                © 2024 Your Company Name. All rights reserved.
              </Text>
              <Text className="m-0 mb-2 text-center text-[12px] text-gray-500">
                123 Business Street, Suite 100, Philadelphia, PA 19103
              </Text>
              <Text className="m-0 text-center text-[12px] text-gray-500">
                <a href="#" className="text-gray-500 underline">
                  Unsubscribe
                </a>{" "}
                |
                <a href="#" className="ml-2 text-gray-500 underline">
                  Update Preferences
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
