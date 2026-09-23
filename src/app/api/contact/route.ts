import { track } from "@vercel/analytics/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";

function clean(value: unknown, max = 1500) {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (clean(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 80);
  const email = clean(body.email, 200);
  const message = clean(body.message);
  const consent = Boolean(body.consent);

  if (!name || !email.includes("@") || message.length < 10 || !consent) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return NextResponse.json(
      { error: "Contact service not configured" },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `Nouvelle demande Celest — ${name}`,
    text: `Nom : ${name}\nE-mail : ${email}\n\n${message}`,
  });

  await resend.emails.send({
    from,
    to: email,
    subject: "Celest Coiffure — nous avons bien reçu votre message",
    text:
      "Bonjour " +
      name +
      ",\n\nMerci pour votre message. Il a bien été transmis au salon Celest Coiffure. Nous revenons vers vous dès que possible.\n\nPour une réservation, utilisez directement Planity.\n\nCelest Coiffure",
  });

  await track("ContactSubmission", { source: "website" }).catch(() => undefined);

  return NextResponse.json({ ok: true });
}
