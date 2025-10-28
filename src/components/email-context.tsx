"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface EmailContextType {
  emailContent: string;
  setEmailContent: (content: string) => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

const defaultEmailContent = `import * as React from 'react';
import { Html, Button, Hr, Text } from "@react-email/components";

export function MyTemplate(props) {
  return (
    <Html lang="en">
      <Text>Some title</Text>
      <Hr />
      <Button href="https://example.com">Click me</Button>
    </Html>
  );
}

export default MyTemplate;`;

export function EmailProvider({ children }: { children: ReactNode }) {
  const [emailContent, setEmailContent] = useState(defaultEmailContent);

  return (
    <EmailContext.Provider value={{ emailContent, setEmailContent }}>
      {children}
    </EmailContext.Provider>
  );
}

export function useEmail() {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error("useEmail must be used within an EmailProvider");
  }
  return context;
}
