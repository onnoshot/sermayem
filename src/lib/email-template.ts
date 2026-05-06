function fmt(amount: number): string {
  return new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + " TL"
}

const MONTHS_TR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
]

export interface MonthlyEmailData {
  firstName: string
  year: number
  month: number
  totalIncome: number
  totalExpense: number
  topCategories: { name: string; emoji: string; amount: number }[]
  savingsRate: number
  prevMonthNet: number | null
  currency: string
}

export function buildMonthlySummaryEmail(data: MonthlyEmailData): { subject: string; html: string } {
  const {
    firstName, year, month, totalIncome, totalExpense,
    topCategories, savingsRate, prevMonthNet,
  } = data

  const monthName = MONTHS_TR[month - 1]
  const net = totalIncome - totalExpense
  const isPositive = net >= 0
  const netColor = isPositive ? "#22C55E" : "#EF4444"
  const savingsLabel = savingsRate >= 0 ? `%${savingsRate.toFixed(0)}` : `-%${Math.abs(savingsRate).toFixed(0)}`

  const prevDiff = prevMonthNet !== null ? net - prevMonthNet : null
  const prevDiffText = prevDiff !== null
    ? prevDiff >= 0
      ? `Geçen aya göre <span style="color:#22C55E">+${fmt(prevDiff)}</span> daha iyi.`
      : `Geçen aya göre <span style="color:#EF4444">${fmt(prevDiff)}</span> daha kötü.`
    : ""

  const topCatsHtml = topCategories.slice(0, 3).map((cat, i) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #1e1e2e;">
        <span style="font-size:18px;margin-right:8px;">${cat.emoji}</span>
        <span style="color:#cbd5e1;font-size:14px;">${i + 1}. ${cat.name}</span>
      </td>
      <td style="padding:8px 0;border-bottom:1px solid #1e1e2e;text-align:right;color:#f1f5f9;font-weight:600;font-size:14px;font-family:monospace;">${fmt(cat.amount)}</td>
    </tr>
  `).join("")

  const subject = `${monthName} ${year} Finansal Özet — Sermayem`

  const html = `
<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#0d0d16;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d16;padding:40px 16px;">
  <tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

        <!-- Logo -->
        <tr>
          <td style="padding-bottom:32px;text-align:center;">
            <span style="font-size:28px;font-weight:800;color:#fff;letter-spacing:-1px;">Sermayem</span>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="background:#12121f;border:1px solid #1e1e30;border-radius:20px;padding:28px 28px 0;">
            <p style="margin:0 0 4px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">${monthName} ${year} Özeti</p>
            <h1 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#f1f5f9;">Merhaba, ${firstName} 👋</h1>

            <!-- Net balance pill -->
            <div style="background:${isPositive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)"};border:1px solid ${isPositive ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"};border-radius:14px;padding:16px 20px;margin-bottom:24px;">
              <p style="margin:0 0 4px;font-size:12px;color:#6b7280;">Aylık Net</p>
              <p style="margin:0;font-size:28px;font-weight:800;color:${netColor};font-family:monospace;">${isPositive ? "+" : ""}${fmt(net)}</p>
              ${prevDiffText ? `<p style="margin:8px 0 0;font-size:12px;color:#6b7280;">${prevDiffText}</p>` : ""}
            </div>

            <!-- Income / Expense row -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="width:50%;padding-right:6px;">
                  <div style="background:#0f1f14;border:1px solid #1e3a2a;border-radius:12px;padding:14px;">
                    <p style="margin:0 0 4px;font-size:11px;color:#4ade80;">TOPLAM GELİR</p>
                    <p style="margin:0;font-size:16px;font-weight:700;color:#22c55e;font-family:monospace;">${fmt(totalIncome)}</p>
                  </div>
                </td>
                <td style="width:50%;padding-left:6px;">
                  <div style="background:#1f0f0f;border:1px solid #3a1e1e;border-radius:12px;padding:14px;">
                    <p style="margin:0 0 4px;font-size:11px;color:#f87171;">TOPLAM GİDER</p>
                    <p style="margin:0;font-size:16px;font-weight:700;color:#ef4444;font-family:monospace;">${fmt(totalExpense)}</p>
                  </div>
                </td>
              </tr>
            </table>

            <!-- Savings rate -->
            <div style="margin-bottom:24px;">
              <p style="margin:0 0 8px;font-size:12px;color:#6b7280;">Tasarruf Oranı</p>
              <div style="background:#1a1a2e;border-radius:8px;height:8px;overflow:hidden;">
                <div style="background:${isPositive ? "#22c55e" : "#ef4444"};height:8px;width:${Math.min(Math.abs(savingsRate), 100)}%;border-radius:8px;"></div>
              </div>
              <p style="margin:6px 0 0;font-size:13px;color:${isPositive ? "#22c55e" : "#ef4444"};font-weight:600;">${savingsLabel}</p>
            </div>

            <!-- Top categories -->
            ${topCategories.length > 0 ? `
            <div style="margin-bottom:24px;">
              <p style="margin:0 0 12px;font-size:12px;color:#6b7280;">En Yüksek Gider Kalemleri</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${topCatsHtml}
              </table>
            </div>
            ` : ""}

            <!-- CTA -->
            <div style="padding-bottom:28px;text-align:center;">
              <a href="https://sermayem.com/app" style="display:inline-block;background:linear-gradient(135deg,#E50001,#B91C1C);color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:14px;text-decoration:none;letter-spacing:-0.3px;">
                Detayları Görüntüle →
              </a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 0 0;text-align:center;">
            <p style="margin:0;font-size:11px;color:#374151;">Bu emaili aldın çünkü Sermayem hesabın var.</p>
            <p style="margin:4px 0 0;font-size:11px;color:#374151;">
              <a href="https://sermayem.com/app/settings" style="color:#6b7280;text-decoration:underline;">Bildirimleri yönet</a>
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>
`

  return { subject, html }
}
