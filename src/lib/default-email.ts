export const DEFAULT_WELCOME_EMAIL = `import * as React from 'react';
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
} from '@react-email/components';

export default function WelcomeEmail() {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Welcome to our platform! Let's get you started.</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="bg-white rounded-xl shadow-sm max-w-[600px] mx-auto p-10">
            {/* Header */}
            <Section className="text-center mb-8">
              <Heading className="text-[32px] font-bold text-gray-900 m-0 mb-4">
                Welcome aboard! 🎉
              </Heading>
            </Section>

            {/* Main Content */}
            <Section className="mb-8">
              <Text className="text-[18px] text-gray-700 leading-7 m-0 mb-6">
                Thank you for joining our platform! We're thrilled to have you as part of our community.
              </Text>
              
              <Text className="text-[16px] text-gray-600 leading-6 m-0 mb-6">
                To get the most out of your experience, we recommend completing your account setup. This will only take a few minutes and will help us personalize your experience.
              </Text>

              <Text className="text-[16px] text-gray-600 leading-6 m-0 mb-8">
                Here's what you'll be able to do once you complete setup:
              </Text>

              {/* Benefits List */}
              <Section className="mb-8">
                <Text className="text-[16px] text-gray-600 leading-6 m-0 mb-2">
                  • Access all premium features
                </Text>
                <Text className="text-[16px] text-gray-600 leading-6 m-0 mb-2">
                  • Customize your profile and preferences
                </Text>
                <Text className="text-[16px] text-gray-600 leading-6 m-0 mb-2">
                  • Connect with other community members
                </Text>
                <Text className="text-[16px] text-gray-600 leading-6 m-0">
                  • Receive personalized recommendations
                </Text>
              </Section>
            </Section>

            {/* CTA Button */}
            <Section className="text-center mb-8">
              <Button
                href="https://yourplatform.com/setup"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl text-[16px] font-semibold no-underline box-border inline-block"
              >
                Complete Your Setup
              </Button>
            </Section>

            {/* Additional Help */}
            <Section className="mb-8">
              <Text className="text-[14px] text-gray-500 leading-5 m-0 text-center">
                Need help getting started? Feel free to reply to this email or visit our{' '}
                <Button href="https://yourplatform.com/help" className="text-blue-600 underline">
                  help center
                </Button>
                .
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-6">
              <Text className="text-[12px] text-gray-400 leading-4 m-0 text-center mb-2">
                © {new Date().getFullYear()} Your Company Name. All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-400 leading-4 m-0 text-center mb-2">
                123 Business Street, Suite 100, Philadelphia, PA 19103
              </Text>
              <Text className="text-[12px] text-gray-400 leading-4 m-0 text-center">
                <Button href="https://yourplatform.com/unsubscribe" className="text-gray-400 underline">
                  Unsubscribe
                </Button>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
`;
