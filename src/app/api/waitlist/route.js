import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const JSON_PATH = path.join(process.cwd(), "public", "early-access-emails.json");

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, source = "hero_form" } = body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    let emails = [];
    try {
      const fileData = await fs.readFile(JSON_PATH, "utf-8");
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed)) {
        // Strict deduplication of existing file data
        const seen = new Set();
        for (const item of parsed) {
          if (item && item.email) {
            const norm = item.email.trim().toLowerCase();
            if (!seen.has(norm)) {
              seen.add(norm);
              emails.push({
                ...item,
                email: norm,
              });
            }
          }
        }
      }
    } catch {
      emails = [];
    }

    const existingIndex = emails.findIndex(
      (item) => item.email && item.email.toLowerCase() === trimmedEmail
    );

    if (existingIndex === -1) {
      emails.push({
        id: `ea_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        email: trimmedEmail,
        createdAt: new Date().toISOString(),
        source,
      });
      await fs.writeFile(JSON_PATH, JSON.stringify(emails, null, 2), "utf-8");
    } else {
      // Re-write in case previous file had duplicates cleaned
      await fs.writeFile(JSON_PATH, JSON.stringify(emails, null, 2), "utf-8");
    }

    return NextResponse.json({
      success: true,
      message:
        existingIndex !== -1
          ? "You are already registered on the founding early access list!"
          : "You have been successfully added to the early access list!",
      isNew: existingIndex === -1,
      alreadyExists: existingIndex !== -1,
    });
  } catch (err) {
    console.error("Waitlist API error:", err);
    return NextResponse.json(
      { success: false, error: "Server error saving email." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const fileData = await fs.readFile(JSON_PATH, "utf-8");
    const emails = JSON.parse(fileData);
    return NextResponse.json({
      success: true,
      totalCount: Array.isArray(emails) ? emails.length : 0,
      emails: Array.isArray(emails) ? emails : [],
    });
  } catch {
    return NextResponse.json({ success: true, totalCount: 0, emails: [] });
  }
}
