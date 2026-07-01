/**
 * ═══════════════════════════════════════════════════════════════════
 *  Samskruti — Contact Form Handler
 *  Google Apps Script
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Paste this entire file into:
 *    Google Sheet → Extensions → Apps Script
 *
 *  Then deploy as a Web App (see SETUP.md for step-by-step).
 * ═══════════════════════════════════════════════════════════════════
 */

// ── CONFIGURATION ─────────────────────────────────────────────────

var RECIPIENT_EMAIL = "samskruti.info@gmail.com";
var SHEET_NAME      = "Responses";

// ─────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    var data    = JSON.parse(e.postData.contents);
    var name    = sanitise(data.name    || "");
    var email   = sanitise(data.email   || "");
    var subject = sanitise(data.subject || "(no subject)");
    var message = sanitise(data.message || "");
    var lang    = sanitise(data.lang    || "en");
    var site    = sanitise(data.site    || "");   // e.g. "gita.samskruti.info"
    var ts      = new Date();

    saveToSheet(ts, name, email, subject, message, lang, site);
    sendEmailNotification(ts, name, email, subject, message, lang, site);

    return buildResponse({ status: "ok", message: "Message received." });

  } catch (err) {
    Logger.log("Error in doPost: " + err.toString());
    return buildResponse({ status: "error", message: err.toString() });
  }
}

function doGet(e) {
  return buildResponse({
    status:  "ok",
    message: "Samskruti contact form endpoint is live.",
    time:    new Date().toString()
  });
}

// ── HELPERS ───────────────────────────────────────────────────────

function saveToSheet(ts, name, email, subject, message, lang, site) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Timestamp", "Name", "Email", "Subject", "Message", "Language", "Site"
    ]);
    sheet.getRange(1, 1, 1, 7).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    ts.toLocaleString("en-AU", { timeZone: "Australia/Sydney" }),
    name,
    email,
    subject,
    message,
    lang.toUpperCase(),
    site
  ]);

  sheet.autoResizeColumns(1, 7);
}

function sendEmailNotification(ts, name, email, subject, message, lang, site) {
  var timeStr = ts.toLocaleString("en-AU", {
    timeZone:  "Australia/Sydney",
    dateStyle: "full",
    timeStyle: "short"
  });

  // Derive a clean display name and URL from the site field
  var siteLabel = site || "Samskruti";
  var siteUrl   = site ? "https://" + site : "https://samskruti.info";

  var htmlBody = [
    '<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;border:1px solid #e8c878;border-radius:10px;overflow:hidden;">',

    // Header
    '<div style="background:linear-gradient(135deg,#7a4d06,#b8730a);padding:24px 28px;">',
    '<p style="margin:0;font-family:serif;font-size:20px;color:#faedc8;letter-spacing:0.05em;">🕉 ' + escHtml(siteLabel) + '</p>',
    '<p style="margin:6px 0 0;font-size:13px;color:rgba(250,237,200,0.8);">New contact form message</p>',
    '</div>',

    // Body
    '<div style="padding:24px 28px;background:#fffbf3;">',
    '<table style="width:100%;border-collapse:collapse;font-size:14px;">',

    '<tr><td style="padding:8px 0;color:#a07850;font-style:italic;width:90px;vertical-align:top;">From</td>',
    '<td style="padding:8px 0;color:#2c1a0e;font-weight:bold;">' + escHtml(name) + '</td></tr>',

    '<tr><td style="padding:8px 0;color:#a07850;font-style:italic;vertical-align:top;">Email</td>',
    '<td style="padding:8px 0;"><a href="mailto:' + escHtml(email) + '" style="color:#b8730a;">' + escHtml(email) + '</a></td></tr>',

    '<tr><td style="padding:8px 0;color:#a07850;font-style:italic;vertical-align:top;">Subject</td>',
    '<td style="padding:8px 0;color:#2c1a0e;">' + escHtml(subject) + '</td></tr>',

    '<tr><td style="padding:8px 0;color:#a07850;font-style:italic;vertical-align:top;">Language</td>',
    '<td style="padding:8px 0;color:#2c1a0e;">' + langLabel(lang) + '</td></tr>',

    site ? (
      '<tr><td style="padding:8px 0;color:#a07850;font-style:italic;vertical-align:top;">Site</td>' +
      '<td style="padding:8px 0;"><a href="' + escHtml(siteUrl) + '" style="color:#b8730a;">' + escHtml(siteLabel) + '</a></td></tr>'
    ) : '',

    '<tr><td style="padding:8px 0;color:#a07850;font-style:italic;vertical-align:top;">Time</td>',
    '<td style="padding:8px 0;color:#2c1a0e;">' + escHtml(timeStr) + '</td></tr>',

    '</table>',

    '<hr style="border:none;border-top:1px solid #e8c87844;margin:16px 0;">',
    '<p style="color:#a07850;font-style:italic;font-size:13px;margin:0 0 8px;">Message</p>',
    '<div style="background:#faf5eb;border-left:3px solid #b8730a;padding:14px 16px;border-radius:0 8px 8px 0;">',
    '<p style="margin:0;color:#2c1a0e;line-height:1.75;font-size:14px;">' + escHtml(message).replace(/\n/g,'<br>') + '</p>',
    '</div>',
    '</div>',

    // Footer
    '<div style="padding:14px 28px;background:#fff9ef;border-top:1px solid #e8c87833;text-align:center;">',
    '<p style="margin:0;font-size:11px;color:#c8a878;">',
    'Sent from <a href="' + escHtml(siteUrl) + '" style="color:#b8730a;text-decoration:none;">' + escHtml(siteLabel) + '</a>',
    ' · Reply directly to <a href="mailto:' + escHtml(email) + '" style="color:#b8730a;">' + escHtml(email) + '</a>',
    '</p>',
    '</div>',

    '</div>'
  ].join("");

  var plainBody = [
    "New message via " + siteLabel,
    "─────────────────────────────────────",
    "From:     " + name,
    "Email:    " + email,
    "Subject:  " + subject,
    "Language: " + langLabel(lang),
    site ? "Site:     " + siteLabel : "",
    "Time:     " + timeStr,
    "",
    "Message:",
    message,
    "",
    "─────────────────────────────────────",
    "Reply to: " + email
  ].filter(Boolean).join("\n");

  GmailApp.sendEmail(
    RECIPIENT_EMAIL,
    "✉ " + siteLabel + ": " + subject + " (from " + name + ")",
    plainBody,
    {
      htmlBody: htmlBody,
      replyTo:  email,
      name:     name + " via " + siteLabel
    }
  );
}

function buildResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function sanitise(str) {
  return String(str)
    .replace(/<[^>]*>/g, "")
    .replace(/&/g, "&amp;")
    .trim()
    .substring(0, 2000);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function langLabel(lang) {
  var labels = { en: "English", te: "Telugu (తెలుగు)", sa: "Sanskrit (संस्कृतम्)" };
  return labels[lang.toLowerCase()] || lang;
}
