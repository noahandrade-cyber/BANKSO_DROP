const DESTINATION_EMAIL = "banksostreetwear@gmail.com";
const PRICE = 24.99;

function doGet() {
  return ContentService.createTextOutput("BANKSO API OK")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const data = readData_(e);
    const type = String(data.type || "reservation").toLowerCase();

    if (type === "contact") {
      saveContact_(data);
      sendContactEmail_(data);
      return json_("success", "Message reçu");
    }

    saveReservation_(data);
    sendReservationEmail_(data);
    return json_("success", "Réservation reçue");
  } catch (err) {
    console.error(err);
    return json_("error", String(err));
  }
}

function readData_(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      const parsed = JSON.parse(e.postData.contents);
      if (parsed && typeof parsed === "object") return parsed;
    } catch (_) {}
  }
  if (e && e.parameter) return e.parameter;
  return {};
}

function getSpreadsheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("Le script doit être lié au Google Sheet BANKSO.");
  return ss;
}

function saveContact_(d) {
  const ss = getSpreadsheet_();
  let sh = ss.getSheetByName("Contacts");
  if (!sh) {
    sh = ss.insertSheet("Contacts");
    sh.appendRow(["Date","Nom","E-mail","Sujet","Message","Source"]);
  }
  sh.appendRow([
    new Date(), d.name || "", d.email || "", d.subject || "",
    d.message || "", d.source || ""
  ]);
}

function parseItems_(d) {
  let items = d.items || [];
  if (typeof items === "string") {
    try { items = JSON.parse(items); } catch (_) { items = []; }
  }
  return Array.isArray(items) ? items : [];
}

function normaliseItems_(d) {
  return parseItems_(d).map(x => {
    const quantity = Math.max(1, Number(x.quantity || 1));
    return {
      name: x.name || x.product || "Article",
      size: x.size || "",
      quantity: quantity,
      unitPrice: PRICE,
      lineTotal: quantity * PRICE
    };
  });
}

function saveReservation_(d) {
  const ss = getSpreadsheet_();
  let sh = ss.getSheetByName("Reservations");

  if (!sh) {
    sh = ss.insertSheet("Reservations");
    sh.appendRow([
      "ID réservation","Date","Nom","E-mail","Téléphone",
      "Article","Taille","Quantité","Prix unitaire","Total article",
      "Nombre total articles","Total réservation","Message"
    ]);
  }

  const items = normaliseItems_(d);
  const reservationId = "BK-" +
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") +
    "-" + Math.floor(100 + Math.random() * 900);

  const totalCount = items.reduce((sum,x) => sum + x.quantity, 0);
  const total = totalCount * PRICE;

  if (!items.length) {
    sh.appendRow([
      reservationId,new Date(),d.name || "",d.email || "",d.phone || "",
      "Article non précisé","",1,PRICE,PRICE,totalCount,total,d.message || ""
    ]);
    return;
  }

  // ONE ROW PER DISTINCT ARTICLE + SIZE, with the real quantity.
  items.forEach(item => {
    sh.appendRow([
      reservationId,
      new Date(),
      d.name || "",
      d.email || "",
      d.phone || "",
      item.name,
      item.size,
      item.quantity,
      item.unitPrice,
      item.lineTotal,
      totalCount,
      total,
      d.message || ""
    ]);
  });
}

function sendContactEmail_(d) {
  MailApp.sendEmail({
    to: DESTINATION_EMAIL,
    subject: "BANKSO — Nouvelle question : " + (d.subject || "Contact"),
    body:
`NOUVELLE QUESTION BANKSO

Nom : ${d.name || ""}
E-mail : ${d.email || ""}
Sujet : ${d.subject || ""}

MESSAGE
------------------------------
${d.message || ""}
------------------------------

Tu peux répondre directement à : ${d.email || ""}`,
    replyTo: d.email || undefined,
    name: "BANKSO — Contact"
  });
}

function sendReservationEmail_(d) {
  const items = normaliseItems_(d);
  const totalCount = items.reduce((sum,x) => sum + x.quantity, 0);
  const total = totalCount * PRICE;

  const articleText = items.length
    ? items.map((x,i) =>
        `${i+1}. ${x.name} — taille ${x.size || "-"} — quantité ${x.quantity} — ${x.lineTotal.toFixed(2)} €`
      ).join("\n")
    : "Aucun article reçu";

  MailApp.sendEmail({
    to: DESTINATION_EMAIL,
    subject: "BANKSO — Nouvelle réservation (" + totalCount + " article" + (totalCount > 1 ? "s" : "") + ")",
    body:
`NOUVELLE RÉSERVATION BANKSO

Nom : ${d.name || ""}
E-mail : ${d.email || ""}
Téléphone : ${d.phone || ""}

ARTICLES
------------------------------
${articleText}
------------------------------

Nombre total d'articles : ${totalCount}
TOTAL : ${total.toFixed(2).replace(".", ",")} €
Message : ${d.message || ""}

Aucun paiement n'a été effectué.`,
    replyTo: d.email || undefined,
    name: "BANKSO — Réservation"
  });
}

function json_(status, message) {
  return ContentService.createTextOutput(
    JSON.stringify({status: status, message: message})
  ).setMimeType(ContentService.MimeType.JSON);
}
