"use client";

import { useState } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import { FilePlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEmailPreview } from "@/contexts/email-preview-context";

export function NewFileDialog() {
  const { sandpack } = useSandpack();
  const { addFile } = useEmailPreview();
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!fileName.trim()) {
      setError("Filename is required");
      return;
    }

    let finalFileName = fileName.trim();
    if (!finalFileName.endsWith(".tsx")) {
      finalFileName += ".tsx";
    }

    const filePath = `/${finalFileName}`;

    if (sandpack.files[filePath]) {
      setError("File already exists");
      return;
    }

    addFile(filePath, exampleTemplate);

    setFileName("");
    setError("");
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setFileName("");
      setError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <FilePlusIcon size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Email Template</DialogTitle>
          <DialogDescription>
            Create a new TSX file for your email template. The .tsx extension
            will be added automatically if not provided.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="filename">Filename</Label>
            <Input
              id="filename"
              placeholder="my-template.tsx"
              value={fileName}
              onChange={(e) => {
                setFileName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreate();
                }
              }}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create File</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const exampleTemplate = `
import * as React from 'react';
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
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-[32px] font-bold text-gray-900 m-0 mb-[16px]">
                Welcome aboard! 🎉
              </Heading>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[18px] text-gray-700 leading-[28px] m-0 mb-[24px]">
                Thank you for joining our platform! We're thrilled to have you as part of our community.
              </Text>
              
              <Text className="text-[16px] text-gray-600 leading-[24px] m-0 mb-[24px]">
                To get the most out of your experience, we recommend completing your account setup. This will only take a few minutes and will help us personalize your experience.
              </Text>

              <Text className="text-[16px] text-gray-600 leading-[24px] m-0 mb-[32px]">
                Here's what you'll be able to do once you complete setup:
              </Text>

              {/* Benefits List */}
              <Section className="mb-[32px]">
                <Text className="text-[16px] text-gray-600 leading-[24px] m-0 mb-[8px]">
                  • Access all premium features
                </Text>
                <Text className="text-[16px] text-gray-600 leading-[24px] m-0 mb-[8px]">
                  • Customize your profile and preferences
                </Text>
                <Text className="text-[16px] text-gray-600 leading-[24px] m-0 mb-[8px]">
                  • Connect with other community members
                </Text>
                <Text className="text-[16px] text-gray-600 leading-[24px] m-0">
                  • Receive personalized recommendations
                </Text>
              </Section>
            </Section>

            {/* CTA Button */}
            <Section className="text-center mb-[32px]">
              <Button
                href="https://yourplatform.com/setup"
                className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border inline-block"
              >
                Complete Your Setup
              </Button>
            </Section>

            {/* Additional Help */}
            <Section className="mb-[32px]">
              <Text className="text-[14px] text-gray-500 leading-[20px] m-0 text-center">
                Need help getting started? Feel free to reply to this email or visit our{' '}
                <Button href="https://yourplatform.com/help" className="text-blue-600 underline">
                  help center
                </Button>
                .
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-[24px]">
              <Text className="text-[12px] text-gray-400 leading-[16px] m-0 text-center mb-[8px]">
                © {new Date().getFullYear()} Your Company Name. All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-400 leading-[16px] m-0 text-center mb-[8px]">
                123 Business Street, Suite 100, Philadelphia, PA 19103
              </Text>
              <Text className="text-[12px] text-gray-400 leading-[16px] m-0 text-center">
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
