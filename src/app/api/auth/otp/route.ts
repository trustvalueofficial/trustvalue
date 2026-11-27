import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

type AuthChannel = "mobile" | "email";

interface OtpTokenPayload {
  channel: AuthChannel;
  identifier: string;
  otpHash: string;
  mode: "login" | "signup";
  name?: string;
  exp: number;
}

interface StoredAccount {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

const OTP_COOKIE = "tv_otp_session";
const ACCOUNTS_COOKIE = "tv_known_accounts";
const OTP_TTL_MS = 5 * 60 * 1000;

// Seeded returning account so testers can experience the "account exists -> Login" path immediately
const SEEDED_ACCOUNTS: StoredAccount[] = [
  {
    id: "seed_demo",
    name: "Priya Sharma",
    phone: "9876543210",
    email: "demo@trustvalue.ai",
  },
];

function getSigningSecret(): string {
  return process.env.AUTH_OTP_SECRET || process.env.REVALIDATION_SECRET || "trustvalue_otp_dev_secret_2026";
}

function signData(payload: string): string {
  return crypto.createHmac("sha256", getSigningSecret()).update(payload).digest("base64url");
}

function encodeSignedToken<T>(data: T): string {
  const json = Buffer.from(JSON.stringify(data), "utf8").toString("base64url");
  return `${json}.${signData(json)}`;
}

function decodeSignedToken<T>(token: string | undefined): T | null {
  if (!token || !token.includes(".")) return null;
  const [json, sig] = token.split(".");
  if (!json || !sig) return null;
  const expected = signData(json);
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(json, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

function normalizeIdentifier(channel: AuthChannel, raw: string): string {
  if (channel === "mobile") {
    return raw.replace(/\D/g, "").slice(-10);
  }
  return raw.trim().toLowerCase();
}

function validateIdentifier(channel: AuthChannel, clean: string): string | null {
  if (channel === "mobile") {
    if (!/^[6-9]\d{9}$/.test(clean) && !/^\d{10}$/.test(clean)) {
      return "Enter a valid 10-digit mobile number.";
    }
    return null;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return "Enter a valid email address.";
  }
  return null;
}

function hashOtp(identifier: string, otp: string): string {
  return crypto.createHmac("sha256", getSigningSecret()).update(`${identifier}:${otp}`).digest("hex");
}

function readKnownAccounts(req: NextRequest): StoredAccount[] {
  const raw = req.cookies.get(ACCOUNTS_COOKIE)?.value;
  const decoded = decodeSignedToken<StoredAccount[]>(raw);
  const list = Array.isArray(decoded) ? decoded : [];
  return [...SEEDED_ACCOUNTS, ...list];
}

function findAccount(accounts: StoredAccount[], channel: AuthChannel, clean: string): StoredAccount | undefined {
  return accounts.find((acc) =>
    channel === "mobile" ? acc.phone === clean : acc.email?.toLowerCase() === clean
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body?.action as "check" | "send" | "verify";
    const channel: AuthChannel = body?.channel === "email" ? "email" : "mobile";
    const clean = normalizeIdentifier(channel, String(body?.identifier || ""));

    const err = validateIdentifier(channel, clean);
    if (err) {
      return NextResponse.json({ ok: false, error: err }, { status: 400 });
    }

    const accounts = readKnownAccounts(req);
    const existing = findAccount(accounts, channel, clean);

    if (action === "check") {
      return NextResponse.json({
        ok: true,
        accountExists: Boolean(existing),
        mode: existing ? "login" : "signup",
        displayName: existing?.name,
      });
    }

    if (action === "send") {
      const requestedMode = body?.mode === "login" || body?.mode === "signup" ? body.mode : undefined;
      const mode: "login" | "signup" = existing ? "login" : requestedMode || "signup";
      const displayName = String(body?.name || existing?.name || "").trim();

      if (mode === "signup" && body?.requireProfile && displayName.length < 2) {
        return NextResponse.json(
          { ok: false, error: "Enter your display name (at least 2 characters) to create your account." },
          { status: 400 }
        );
      }

      const otp = String(crypto.randomInt(100000, 999999));
      const payload: OtpTokenPayload = {
        channel,
        identifier: clean,
        otpHash: hashOtp(clean, otp),
        mode,
        name: displayName || undefined,
        exp: Date.now() + OTP_TTL_MS,
      };

      const res = NextResponse.json({
        ok: true,
        accountExists: Boolean(existing),
        mode,
        displayName: existing?.name || displayName || undefined,
        channel,
        maskedIdentifier:
          channel === "mobile"
            ? `+91 ••••••${clean.slice(-4)}`
            : clean.replace(/(^.).*(@.*$)/, "$1••••$2"),
        expiresInSeconds: 300,
        // Surface preview OTP when external SMS/SMTP provider is not configured
        previewOtp: otp,
      });

      res.cookies.set(OTP_COOKIE, encodeSignedToken(payload), {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 300,
      });

      return res;
    }

    if (action === "verify") {
      const otp = String(body?.otp || "").trim();
      if (!/^\d{6}$/.test(otp)) {
        return NextResponse.json({ ok: false, error: "Enter the 6-digit OTP code." }, { status: 400 });
      }

      const tokenPayload = decodeSignedToken<OtpTokenPayload>(req.cookies.get(OTP_COOKIE)?.value);
      if (!tokenPayload || tokenPayload.exp < Date.now()) {
        return NextResponse.json(
          { ok: false, error: "OTP expired. Please request a new code." },
          { status: 400 }
        );
      }

      if (tokenPayload.channel !== channel || tokenPayload.identifier !== clean) {
        return NextResponse.json(
          { ok: false, error: "This code does not match the entered mobile or email." },
          { status: 400 }
        );
      }

      const expectedHash = hashOtp(clean, otp);
      if (tokenPayload.otpHash !== expectedHash) {
        return NextResponse.json({ ok: false, error: "Incorrect OTP code. Please check and try again." }, { status: 401 });
      }

      const finalName =
        existing?.name ||
        String(body?.name || tokenPayload.name || "").trim() ||
        (channel === "email" ? clean.split("@")[0] : "Consumer");

      const user: StoredAccount = {
        id: existing?.id || `usr_${Date.now()}`,
        name: finalName,
        ...(channel === "mobile" ? { phone: clean } : { email: clean }),
      };

      const res = NextResponse.json({
        ok: true,
        mode: existing ? "login" : "signup",
        user,
      });

      res.cookies.delete(OTP_COOKIE);

      if (!existing) {
        const storedList = decodeSignedToken<StoredAccount[]>(req.cookies.get(ACCOUNTS_COOKIE)?.value) || [];
        const updatedList = [...storedList.slice(-19), user];
        res.cookies.set(ACCOUNTS_COOKIE, encodeSignedToken(updatedList), {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
        });
      }

      return res;
    }

    return NextResponse.json({ ok: false, error: "Unsupported action." }, { status: 400 });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request payload." }, { status: 400 });
  }
}
