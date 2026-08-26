
// ============================================================
// Netlify Function: subscribe
// Recibe { email, archetype } desde el formulario del quiz y:
//   1. Crea (o reutiliza) el contacto en Systeme.io con sus
//      campos personalizados "bloqueo" y "pdf_link"
//   2. Le asigna la etiqueta "MiZonaDePoderLead", lo que dispara
//      la automatización que ya existe en Systeme (el correo con
//      el PDF).
//
// Requiere la variable de entorno SYSTEME_API_KEY configurada en
// Netlify (Site configuration → Environment variables).
// ============================================================

const SYSTEME_API_BASE = "https://api.systeme.io/api";
const SYSTEME_TAG_NAME = "MiZonaDePoderLead";

const ARCHETYPES = {
  dispersion: {
    bloqueo: "La Experta Dispersa — tu bloqueo: la dispersión",
    file: "dispersion.pdf",
  },
  precio: {
    bloqueo: "La Especialista sin Precio — tu bloqueo: el precio",
    file: "precio.pdf",
  },
  sistema: {
    bloqueo: "La Creativa sin Sistema — tu bloqueo: la falta de sistema",
    file: "sistema.pdf",
  },
  visibilidad: {
    bloqueo: "La Invisible con Trayectoria — tu bloqueo: la visibilidad",
    file: "visibilidad.pdf",
  },
};

function jsonResponse(status, body) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

async function systemeFetch(path, options = {}) {
  const apiKey = process.env.SYSTEME_API_KEY;
  if (!apiKey) throw new Error("Falta la variable de entorno SYSTEME_API_KEY en Netlify");

  const res = await fetch(`${SYSTEME_API_BASE}${path}`, {
    ...options,
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": options.contentType || "application/json",
      ...(options.headers || {}),
    },
  });
  return res;
}

async function findContactIdByEmail(email) {
  const res = await systemeFetch(`/contacts?limit=100`);
  if (!res.ok) return null;
  const data = await res.json();
  const items = data.items || [];
  const match = items.find((c) => (c.email || "").toLowerCase() === email.toLowerCase());
  return match ? match.id : null;
}

async function upsertContact(email, fields) {
  const createRes = await systemeFetch(`/contacts`, {
    method: "POST",
    body: JSON.stringify({ email, locale: "es", fields }),
  });

  if (createRes.status === 201) {
    const contact = await createRes.json();
    return contact.id;
  }

  const existingId = await findContactIdByEmail(email);
  if (!existingId) {
    const detail = await createRes.text().catch(() => "");
    throw new Error(`No se pudo crear ni encontrar el contacto (status ${createRes.status}): ${detail}`);
  }

  const patchRes = await systemeFetch(`/contacts/${existingId}`, {
    method: "PATCH",
    contentType: "application/merge-patch+json",
    body: JSON.stringify({ fields }),
  });
  if (!patchRes.ok) {
    const detail = await patchRes.text().catch(() => "");
    throw new Error(`No se pudo actualizar el contacto existente (status ${patchRes.status}): ${detail}`);
  }

  return existingId;
}

async function getTagId(tagName) {
  const res = await systemeFetch(`/tags?limit=100`);
  if (!res.ok) throw new Error(`No se pudo listar etiquetas (status ${res.status})`);
  const data = await res.json();
  const items = data.items || [];
  const tag = items.find((t) => t.name === tagName);
  if (!tag) throw new Error(`No se encontró la etiqueta "${tagName}" en Systeme`);
  return tag.id;
}

async function assignTag(contactId, tagId) {
  const res = await systemeFetch(`/contacts/${contactId}/tags`, {
    method: "POST",
    body: JSON.stringify({ tagId }),
  });
  if (!res.ok && res.status !== 204) {
    const detail = await res.text().catch(() => "");
    throw new Error(`No se pudo asignar la etiqueta (status ${res.status}): ${detail}`);
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { ok: false, error: "Method not allowed" });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { ok: false, error: "Invalid JSON" });
  }

  const { email, archetype } = payload;
  const archetypeData = ARCHETYPES[archetype];

  if (!email || !archetypeData) {
    return jsonResponse(400, { ok: false, error: "Missing or invalid email/archetype" });
  }

  const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || "";
  const pdfLink = `${siteUrl}/assets/pdfs/${archetypeData.file}`;

  try {
    const contactId = await upsertContact(email, [
      { slug: "bloqueo", value: archetypeData.bloqueo },
      { slug: "pdf_link", value: pdfLink },
    ]);

    const tagId = await getTagId(SYSTEME_TAG_NAME);
    await assignTag(contactId, tagId);

    return jsonResponse(200, { ok: true });
  } catch (err) {
    console.error("Error conectando con Systeme:", err.message);
    return jsonResponse(200, { ok: false, error: err.message });
  }
};
