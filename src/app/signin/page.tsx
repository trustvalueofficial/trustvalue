import type { Metadata } from "next";
import { paths } from "@/lib/routing";
import { meta } from "@/lib/seo";
import { SignInShell } from "@/components/signincomponent";

export const metadata: Metadata = meta(
  "Sign In or Create Account",
  "Log in or sign up with Mobile or Email OTP on TrustValue.ai to publish verified consumer reviews and track audits.",
  paths.signin()
);

export default function SignInPage() {
  return <SignInShell />;
}
