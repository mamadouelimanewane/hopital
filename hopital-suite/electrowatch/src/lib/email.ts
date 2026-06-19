import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = "CNRA ElectroWatch <noreply@cnra.sn>"

export async function envoyerAlerteDesequilibre(opts: {
  destinataires: string[]
  medianom: string
  partiNom: string
  ecartPct: number
  campagneNom: string
}) {
  const niveau = opts.ecartPct >= 40 ? "CRITIQUE" : "AVERTISSEMENT"
  const couleur = opts.ecartPct >= 40 ? "#dc2626" : "#d97706"

  return resend.emails.send({
    from: FROM,
    to: opts.destinataires,
    subject: `[${niveau}] Déséquilibre détecté — ${opts.medianom} / ${opts.campagneNom}`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
        <!-- Header -->
        <tr><td style="background:#1A3A6B;padding:32px 40px;">
          <table width="100%"><tr>
            <td><span style="color:#fff;font-size:20px;font-weight:bold;">CNRA ElectroWatch</span><br>
            <span style="color:#93c5fd;font-size:12px;">Observatoire Électoral des Médias</span></td>
            <td align="right"><span style="background:${couleur};color:#fff;padding:6px 16px;border-radius:20px;font-size:13px;font-weight:bold;">${niveau}</span></td>
          </tr></table>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px;">
          <h2 style="color:#1A3A6B;margin:0 0 8px;">Déséquilibre du temps de parole détecté</h2>
          <p style="color:#6b7280;margin:0 0 32px;">Campagne : <strong>${opts.campagneNom}</strong></p>
          <table width="100%" style="background:#f9fafb;border-radius:8px;padding:24px;margin-bottom:24px;">
            <tr><td style="padding:8px 0;">
              <span style="color:#6b7280;font-size:13px;">Média concerné</span><br>
              <span style="color:#111827;font-size:18px;font-weight:bold;">${opts.medianom}</span>
            </td></tr>
            <tr><td style="padding:8px 0;border-top:1px solid #e5e7eb;">
              <span style="color:#6b7280;font-size:13px;">Parti le plus favorisé</span><br>
              <span style="color:#111827;font-size:18px;font-weight:bold;">${opts.partiNom}</span>
            </td></tr>
            <tr><td style="padding:8px 0;border-top:1px solid #e5e7eb;">
              <span style="color:#6b7280;font-size:13px;">Écart constaté</span><br>
              <span style="color:${couleur};font-size:28px;font-weight:bold;">${opts.ecartPct.toFixed(1)}%</span>
            </td></tr>
          </table>
          <p style="color:#374151;line-height:1.6;">Conformément aux dispositions du CNRA relatives à l'équité du temps de parole en période électorale, ce déséquilibre nécessite une attention immédiate.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/alertes" style="display:inline-block;background:#1A3A6B;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px;">Voir l'alerte dans ElectroWatch →</a>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">© ${new Date().getFullYear()} CNRA — Conseil National de Régulation de l'Audiovisuel du Sénégal<br>Ce message est généré automatiquement par CNRA ElectroWatch.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  })
}

export async function envoyerRapportHebdomadaire(opts: {
  destinataires: string[]
  campagneNom: string
  periode: string
  totalInterventions: number
  totalAlertes: number
  scoreEquite: number
  pdfBase64?: string
}) {
  const scoreColor = opts.scoreEquite >= 80 ? "#166534" : opts.scoreEquite >= 60 ? "#d97706" : "#dc2626"

  return resend.emails.send({
    from: FROM,
    to: opts.destinataires,
    subject: `Rapport hebdomadaire ElectroWatch — ${opts.campagneNom} (${opts.periode})`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#1A3A6B;padding:32px 40px;">
          <span style="color:#fff;font-size:20px;font-weight:bold;">CNRA ElectroWatch</span><br>
          <span style="color:#93c5fd;font-size:13px;">Rapport hebdomadaire — ${opts.periode}</span>
        </td></tr>
        <tr><td style="padding:40px;">
          <h2 style="color:#1A3A6B;margin:0 0 24px;">Synthèse de la semaine</h2>
          <h3 style="color:#6b7280;margin:0 0 20px;font-weight:normal;">Campagne : ${opts.campagneNom}</h3>
          <table width="100%" style="margin-bottom:32px;">
            <tr>
              <td width="33%" style="text-align:center;background:#f0f4ff;border-radius:8px;padding:20px;margin:4px;">
                <div style="font-size:32px;font-weight:bold;color:#1A3A6B;">${opts.totalInterventions}</div>
                <div style="color:#6b7280;font-size:13px;">Interventions</div>
              </td>
              <td width="4%"></td>
              <td width="33%" style="text-align:center;background:#fef9f0;border-radius:8px;padding:20px;">
                <div style="font-size:32px;font-weight:bold;color:#d97706;">${opts.totalAlertes}</div>
                <div style="color:#6b7280;font-size:13px;">Alertes</div>
              </td>
              <td width="4%"></td>
              <td width="33%" style="text-align:center;background:#f0fdf4;border-radius:8px;padding:20px;">
                <div style="font-size:32px;font-weight:bold;color:${scoreColor};">${opts.scoreEquite}/100</div>
                <div style="color:#6b7280;font-size:13px;">Score équité</div>
              </td>
            </tr>
          </table>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;background:#1A3A6B;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">Accéder au tableau de bord →</a>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">© ${new Date().getFullYear()} CNRA ElectroWatch — Rapport généré automatiquement</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  })
}
