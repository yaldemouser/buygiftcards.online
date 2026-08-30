// Kit.com (formerly ConvertKit) integration for newsletter signups.
// I don't have live Kit credentials to test this against — built from Kit's
// publicly documented v4 API, not verified working. Confirm the endpoint
// shape against your own account (https://developers.kit.com) once you have
// a real API key, before relying on it.
//
// Activates automatically once KIT_API_KEY (and optionally KIT_FORM_ID) are
// set — see .env.example. Until then, subscribeToKit() no-ops with a
// warning; the subscriber is still saved in our own database either way
// (src/app/api/subscribe/route.ts), so no signup is lost while this is
// unconfigured.

export async function subscribeToKit(email: string): Promise<{ synced: boolean }> {
  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;

  if (!apiKey) {
    console.warn(`[newsletter] KIT_API_KEY not set — ${email} saved locally only, not synced to Kit.com`);
    return { synced: false };
  }

  // Kit v4: add a subscriber, then (if a form is configured) attach them to
  // it so they land in the right sequence/tag in your Kit account.
  const subRes = await fetch("https://api.kit.com/v4/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Kit-Api-Key": apiKey,
    },
    body: JSON.stringify({ email_address: email }),
  });

  if (!subRes.ok) {
    const body = await subRes.text().catch(() => "");
    throw new Error(`Kit.com subscribe failed (${subRes.status}): ${body}`);
  }

  if (formId) {
    const formRes = await fetch(`https://api.kit.com/v4/forms/${formId}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Kit-Api-Key": apiKey,
      },
      body: JSON.stringify({ email_address: email }),
    });
    if (!formRes.ok) {
      const body = await formRes.text().catch(() => "");
      console.error(`[newsletter] Subscribed ${email} to Kit but failed attaching to form ${formId} (${formRes.status}): ${body}`);
    }
  }

  return { synced: true };
}
