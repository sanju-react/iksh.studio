export interface EmailActionOptions {
  to?: string;
  subject?: string;
  body?: string;
  copyText?: string;
  notifyMessage?: string;
}

/**
 * Robust clipboard copy with fallback for older browsers or non-secure contexts
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback to execCommand below
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}

/**
 * Returns Gmail Web composer direct compose URL
 */
export function getGmailComposeUrl(to: string, subject: string = '', body: string = ''): string {
  const params = new URLSearchParams();
  params.set('view', 'cm');
  params.set('fs', '1');
  params.set('to', to);
  if (subject) params.set('su', subject);
  if (body) params.set('body', body);
  return `https://mail.google.com/mail/?${params.toString()}`;
}

/**
 * Returns standard mailto URL
 */
export function getMailtoUrl(to: string, subject: string = '', body: string = ''): string {
  const parts: string[] = [];
  if (subject) parts.push(`subject=${encodeURIComponent(subject)}`);
  if (body) parts.push(`body=${encodeURIComponent(body)}`);
  const query = parts.length > 0 ? `?${parts.join('&')}` : '';
  return `mailto:${to}${query}`;
}

/**
 * Dispatches a global event to show the luxury toast notification
 */
export function showStudioToast(detail: {
  title: string;
  message: string;
  email?: string;
  gmailUrl?: string;
  mailtoUrl?: string;
  type?: 'success' | 'info';
}) {
  window.dispatchEvent(
    new CustomEvent('iksh-toast', {
      detail,
    })
  );
}

/**
 * Universal email launcher:
 * 1. Copies email address to clipboard
 * 2. Invokes standard mail client without opening blank new tabs
 * 3. Shows toast notification with email copied feedback
 */
export async function launchEmailClient(
  e?: React.MouseEvent,
  options: EmailActionOptions = {}
) {
  if (e) {
    e.preventDefault();
  }

  const to = options.to || 'ikshstudio0108@gmail.com';
  const subject = options.subject || 'Project Inquiry — IKSH Studio';
  const body = options.body || '';
  const textToCopy = options.copyText || to;

  // 1. Copy to clipboard
  await copyTextToClipboard(textToCopy);

  // 2. Build URLs
  const gmailUrl = getGmailComposeUrl(to, subject, body);
  const mailtoUrl = getMailtoUrl(to, subject, body);

  // 3. Trigger standard mail handler (same window, no new tab)
  try {
    window.location.href = mailtoUrl;
  } catch {
    // ignore
  }

  // 4. Trigger luxury Toast notification
  showStudioToast({
    title: options.copyText ? 'Brief Copied to Clipboard' : 'Email Copied to Clipboard',
    message: options.notifyMessage || `${to} has been copied to your clipboard. Mail composer triggered.`,
    email: to,
    gmailUrl,
    mailtoUrl,
    type: 'success',
  });
}
