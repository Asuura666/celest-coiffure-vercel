"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Request failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <label>
          Prénom
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          E-mail
          <input name="email" type="email" autoComplete="email" required />
        </label>
      </div>
      <label>
        Votre demande
        <textarea
          name="message"
          rows={5}
          minLength={10}
          maxLength={1500}
          required
          placeholder="Une question sur une prestation, un changement de style…"
        />
      </label>
      <label className="honeypot" aria-hidden="true">
        Site web
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="consent">
        <input name="consent" type="checkbox" required /> J’accepte que mes
        informations soient utilisées pour répondre à ma demande.
      </label>
      <button className="button button-dark" disabled={status === "sending"}>
        {status === "sending" ? "Envoi…" : "Envoyer ma demande"}
      </button>
      <p className="form-status" role="status">
        {status === "success" && "Message envoyé. Merci !"}
        {status === "error" &&
          "L’envoi n’a pas fonctionné. Vous pouvez nous contacter par téléphone."}
      </p>
    </form>
  );
}
