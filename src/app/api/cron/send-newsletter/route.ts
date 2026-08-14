import { NextRequest, NextResponse } from 'next/server';
import { isDemoMode, hasResend } from '@/lib/demo/is-demo-mode';
import { isAuthorizedJobRequest } from '@/lib/auth/verify-job-request';

export async function POST(request: NextRequest) {
  if (!isAuthorizedJobRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isDemoMode()) {
    return NextResponse.json({ success: true, message: 'Demo mode - newsletter skipped' });
  }

  if (!hasResend()) {
    return NextResponse.json({ success: true, message: 'Resend API not configured - newsletter skipped' });
  }

  try {
    // 1. Get today's brief
    const { getTodayBrief } = await import('@/lib/services/brief-service');
    const brief = await getTodayBrief();

    if (!brief || brief.items.length === 0) {
      return NextResponse.json({ success: true, message: 'No brief available to send' });
    }

    // 2. Get subscribed users
    let recipients: string[] = [];
    try {
      const { createServiceRoleClient } = await import('@/lib/supabase/server');
      const supabase = await createServiceRoleClient();
      if (supabase) {
        const { data } = await supabase
          .from('newsletter_subscribers')
          .select('email')
          .eq('is_active', true);

        recipients = (data || []).map((d: { email: string }) => d.email);
      }
    } catch {
      // Supabase not available
    }

    if (recipients.length === 0) {
      return NextResponse.json({ success: true, message: 'No subscribers found' });
    }

    // 3. Build HTML email
    const html = buildNewsletterHTML(brief);

    // 4. Send via Resend API
    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.NEWSLETTER_FROM_EMAIL || 'GlobalNow <noreply@globalnow.dev>';

    let sentCount = 0;

    // Send in batches of 50
    for (let i = 0; i < recipients.length; i += 50) {
      const batch = recipients.slice(i, i + 50);

      const res = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`,
        },
        body: JSON.stringify(
          batch.map(email => ({
            from: fromEmail,
            to: email,
            subject: `[GlobalNow] ${brief.date} 모닝 브리프`,
            html,
          }))
        ),
      });

      if (res.ok) {
        sentCount += batch.length;
      } else {
        console.error('Resend batch failed:', await res.text());
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      sentCount,
      totalRecipients: recipients.length,
    });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Send failed' }, { status: 500 });
  }
}

/** Build simple HTML newsletter template */
function buildNewsletterHTML(brief: { date: string; summary: string; items: Array<{ rank: number; titleKo: string; summaryKo: string; category: string; source: string; impact: string }> }): string {
  const impactColor: Record<string, string> = {
    high: '#EF4444',
    medium: '#F59E0B',
    low: '#6B7280',
  };

  const itemsHTML = brief.items.map(item => `
    <tr>
      <td style="padding: 16px; border-bottom: 1px solid #E5E7EB;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span style="background: #1F2937; color: white; padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: bold;">${item.rank}</span>
          <span style="color: ${impactColor[item.impact] || '#6B7280'}; font-size: 12px; font-weight: 600;">${item.impact.toUpperCase()}</span>
          <span style="color: #6B7280; font-size: 12px;">${item.category} | ${item.source}</span>
        </div>
        <h3 style="margin: 4px 0; font-size: 16px; color: #111827;">${item.titleKo}</h3>
        <p style="margin: 4px 0 0; font-size: 14px; color: #4B5563; line-height: 1.5;">${item.summaryKo}</p>
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background: #F3F4F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background: white;">
    <div style="background: #111827; padding: 24px; text-align: center;">
      <h1 style="margin: 0; color: white; font-size: 24px;">GlobalNow</h1>
      <p style="margin: 8px 0 0; color: #9CA3AF; font-size: 14px;">${brief.date} 모닝 브리프</p>
    </div>
    <div style="padding: 16px;">
      <p style="color: #374151; font-size: 14px; line-height: 1.6; background: #F9FAFB; padding: 12px; border-radius: 8px;">${brief.summary}</p>
    </div>
    <table style="width: 100%; border-collapse: collapse;">
      ${itemsHTML}
    </table>
    <div style="padding: 24px; text-align: center; color: #9CA3AF; font-size: 12px;">
      <p>GlobalNow - 글로벌 뉴스를 한눈에</p>
    </div>
  </div>
</body>
</html>`;
}
