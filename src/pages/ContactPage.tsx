import React, { useState, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { studioInfo } from '../data/studio';
import { MagneticButton } from '../components/common/MagneticButton';
import { LiveClock } from '../components/common/LiveClock';
import { SoftAurora } from '../components/common/SoftAurora';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import {
  copyTextToClipboard,
  getGmailComposeUrl,
  getMailtoUrl,
  launchEmailClient,
  showStudioToast,
} from '../utils/contact';
import {
  Check,
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Copy,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STUDIO_PHONE_NUMBER = '918849886332'; // +91 88498 86332

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectTypes: [] as string[],
    message: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const lines = [
    { text: "LET'S CREATE", className: 'text-ivory-200 font-serif-title tracking-tight' },
    { text: 'SOMETHING', className: 'text-accent-gold font-editorial italic font-normal' },
    { text: 'WORTH REMEMBERING.', className: 'text-white font-sans font-black tracking-tighter' },
  ];

  useLayoutEffect(() => {
    const words = headlineRef.current?.querySelectorAll('.hero-word');
    if (!words || words.length === 0) return;

    gsap.killTweensOf(words);
    if (subtitleRef.current) gsap.killTweensOf(subtitleRef.current);

    gsap.set(words, {
      yPercent: 120,
      opacity: 0,
      rotateX: 25,
      transformOrigin: '50% 100%',
    });
    if (subtitleRef.current) gsap.set(subtitleRef.current, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ delay: 0.1 });

    tl.to(words, {
      yPercent: 0,
      opacity: 1,
      rotateX: 0,
      duration: 0.85,
      stagger: 0.08,
      ease: 'power3.out',
    });

    if (subtitleRef.current) {
      tl.to(
        subtitleRef.current,
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.45'
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !headlineRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(headlineRef.current, {
      x: x * 15,
      y: y * 10,
      rotateX: -y * 4,
      rotateY: x * 4,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (prefersReducedMotion || !headlineRef.current) return;
    gsap.to(headlineRef.current, {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  };

  const projectTypeOptions = [
    'Branding & Visual Identity',
    'Creative Modern Website',
    'Graphic Design & Print',
    'Digital Marketing & Growth',
    'Creative Strategy',
  ];

  const toggleProjectType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      projectTypes: prev.projectTypes.includes(type)
        ? prev.projectTypes.filter((t) => t !== type)
        : [...prev.projectTypes, type],
    }));
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name.';
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 8) {
      errs.phone = 'Please enter a valid mobile number (min 8-10 digits).';
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }
    if (formData.projectTypes.length === 0) {
      errs.projectTypes = 'Please select at least one service.';
    }
    if (!formData.message.trim() || formData.message.length < 5) {
      errs.message = 'Please share a brief summary of your project vision.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const [copiedEmail, setCopiedEmail] = useState(false);

  const formatMessageText = () => {
    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const services = formData.projectTypes;
    const message = formData.message.trim();

    if (!name && !phone && !email && services.length === 0 && !message) {
      return (
        `Hello IKSH Studio,\n\n` +
        `I would like to inquire about your creative services and discuss a potential project.\n\n` +
        `---\n` +
        `Sent via iksh.studio`
      );
    }

    const servicesList =
      services.length > 0
        ? services.map((s) => `- ${s}`).join('\n')
        : '- General Inquiry';

    let text = `NEW PROJECT INQUIRY — IKSH STUDIO\n\n`;

    if (name) text += `Name: ${name}\n`;
    if (phone) text += `Phone: ${phone}\n`;
    if (email) text += `Email: ${email}\n`;
    text += `\n`;

    text += `Services Required:\n`;
    text += `${servicesList}\n\n`;

    if (message) {
      text += `Project Details:\n`;
      text += `${message}\n\n`;
    }

    text += `---\n`;
    text += `Sent via iksh.studio`;

    return text;
  };

  const getWhatsAppUrl = (phoneNumber: string) => {
    const message = encodeURIComponent(formatMessageText());
    return `https://wa.me/${phoneNumber}?text=${message}`;
  };

  const getInquiryGmailUrl = () => {
    return getGmailComposeUrl(
      studioInfo.email,
      `Project Inquiry — ${formData.name || 'New Client'} | IKSH Studio`,
      formatMessageText()
    );
  };

  const getInquiryMailtoUrl = () => {
    return getMailtoUrl(
      studioInfo.email,
      `Project Inquiry — ${formData.name || 'New Client'} | IKSH Studio`,
      formatMessageText()
    );
  };

  const saveLead = () => {
    try {
      const existingLeads = JSON.parse(localStorage.getItem('iksh_leads') || '[]');
      existingLeads.unshift({
        ...formData,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('iksh_leads', JSON.stringify(existingLeads));
    } catch {
      // fallback
    }
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D8C39E', '#F5F3EA', '#2FE69E', '#175443'],
      });
    } catch {
      // fallback
    }
  };

  const handleEmailSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    saveLead();
    await copyTextToClipboard(formatMessageText());

    // Standard mailto dispatch (same tab, no forced blank tabs)
    const mailtoUrl = getInquiryMailtoUrl();
    const gmailUrl = getInquiryGmailUrl();
    try {
      window.location.href = mailtoUrl;
    } catch {
      // fallback
    }

    showStudioToast({
      title: 'Brief Copied to Clipboard',
      message: `Project brief copied. Mail composer opened for ${studioInfo.email}.`,
      email: studioInfo.email,
      gmailUrl,
      mailtoUrl,
      type: 'success',
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      triggerCelebration();
    }, 400);
  };

  const handleWhatsAppSubmit = (phoneNumber: string = STUDIO_PHONE_NUMBER) => {
    saveLead();

    const targetUrl = getWhatsAppUrl(phoneNumber);

    // Direct synchronous window open to avoid mobile/browser popup blockers
    const win = window.open(targetUrl, '_blank', 'noopener,noreferrer');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = targetUrl;
    }

    copyTextToClipboard(formatMessageText()).catch(() => {});

    showStudioToast({
      title: 'Opening WhatsApp Chat',
      message: 'Connecting to IKSH Studio on WhatsApp (+91 88498 86332)...',
      email: studioInfo.email,
      type: 'success',
    });

    setIsSubmitted(true);
    triggerCelebration();
  };

  const handleCopySummary = async () => {
    const text = formatMessageText();
    await copyTextToClipboard(text);
    setCopied(true);
    showStudioToast({
      title: 'Brief Summary Copied',
      message: 'Project details copied to your clipboard.',
      email: studioInfo.email,
      type: 'info',
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyStudioEmail = async () => {
    await copyTextToClipboard(studioInfo.email);
    setCopiedEmail(true);
    showStudioToast({
      title: 'Email Copied',
      message: `${studioInfo.email} copied to your clipboard.`,
      email: studioInfo.email,
      gmailUrl: getGmailComposeUrl(studioInfo.email, 'Studio Inquiry — IKSH Studio'),
      mailtoUrl: getMailtoUrl(studioInfo.email, 'Studio Inquiry — IKSH Studio'),
      type: 'info',
    });
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <main className="relative z-10 select-none">
      {/* Page Hero with SoftAurora - Exactly like Home Hero */}
      <section
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-[85vh] md:min-h-[88vh] flex flex-col justify-between pt-20 sm:pt-24 md:pt-28 pb-12 px-4 sm:px-8 md:px-12 w-full max-w-[1720px] mx-auto z-10 select-none overflow-hidden"
      >
        {/* Soft Aurora Background Canvas */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-70">
          <SoftAurora
            speed={0.6}
            scale={1.5}
            brightness={1.0}
            color1="#071C17"
            color2="#2FE69E"
            color3="#D8C39E"
            noiseFrequency={2.5}
            noiseAmplitude={1.0}
            bandHeight={0.5}
            bandSpread={1.0}
            octaveDecay={0.1}
            layerOffset={0}
            colorSpeed={1.0}
            enableMouseInteraction={true}
            mouseInfluence={0.25}
          />
          {/* Subtle vignette layer to keep typography contrast clean */}
          <div className="absolute inset-0 bg-gradient-to-b from-forest-950/40 via-transparent to-forest-950/60 pointer-events-none" />
        </div>

        {/* Center Main Editorial Heading (Shifted Upwards) */}
        <div className="mt-2 sm:mt-4 md:mt-6 mb-auto py-2 md:py-4 relative w-full z-10 -translate-y-2 sm:-translate-y-4 md:-translate-y-6">
          <h1
            ref={headlineRef}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.8rem] xl:text-[9.2rem] font-medium leading-[0.90] tracking-[-0.035em] uppercase transition-transform will-change-transform"
            style={{ perspective: 1200 }}
          >
            {lines.map((line, lineIdx) => (
              <div
                key={lineIdx}
                className="overflow-hidden py-0.5 flex flex-wrap items-baseline"
              >
                {line.text.split(' ').map((word, wordIdx) => (
                  <span
                    key={wordIdx}
                    className="overflow-hidden mr-4 sm:mr-6 md:mr-8 inline-block"
                  >
                    <span
                      className={`hero-word inline-block will-change-transform transition-colors duration-200 hover:text-accent-emerald ${line.className}`}
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </h1>

          {/* Narrative Description Row */}
          <div className="mt-10 md:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-t border-sage-300/10 pt-8">
            <div className="lg:col-span-8">
              <p
                ref={subtitleRef}
                className="font-sans text-base sm:text-lg md:text-xl text-sage-200/90 font-light leading-relaxed max-w-2xl"
              >
                Tell us about your brand, challenges, and aspirations. Your brief will be formatted and delivered directly to the studio owners.
              </p>
            </div>
            <div className="lg:col-span-4 flex items-center lg:justify-end text-xs font-mono text-accent-emerald">
              <span>ACCEPTING SELECT Q2/Q3 COMMISSIONS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Form and Contact Section */}
      <div className="px-4 sm:px-8 md:px-12 max-w-[1720px] mx-auto pb-20 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Direct Contacts & Info */}
        <div className="lg:col-span-5 space-y-10">
          <div className="p-8 rounded-2xl bg-forest-900 border border-sage-300/15 space-y-6">
            <h3 className="font-serif text-2xl text-white">Direct Inquiries</h3>

            <div className="space-y-4 font-mono text-sm">
              <div>
                <span className="text-xs text-sage-400 block mb-1 uppercase">PHONE & WHATSAPP</span>
                <a
                  href={`https://wa.me/${STUDIO_PHONE_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ivory-200 hover:text-accent-gold flex items-center gap-1.5 transition-colors text-base"
                >
                  <Phone className="w-4 h-4 text-accent-gold" />
                  <span>+91 88498 86332</span>
                </a>
              </div>

              <div>
                <span className="text-xs text-sage-400 block mb-1 uppercase">STUDIO EMAIL</span>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${studioInfo.email}`}
                    onClick={(e) =>
                      launchEmailClient(e, {
                        to: studioInfo.email,
                        subject: 'Studio Inquiry — IKSH Studio',
                      })
                    }
                    className="text-ivory-200 hover:text-accent-gold flex items-center gap-1.5 transition-colors text-base group cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-accent-gold" />
                    <span className="break-all">{studioInfo.email}</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyStudioEmail}
                    title="Copy Studio Email"
                    className="p-1.5 rounded-lg bg-forest-800/80 border border-sage-300/15 text-sage-300 hover:text-accent-gold hover:border-accent-gold transition-colors cursor-pointer"
                  >
                    {copiedEmail ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs text-sage-400 block mb-1 uppercase">LOCATION & TIME</span>
                <div className="flex items-start gap-1.5 text-sage-300">
                  <MapPin className="w-4 h-4 text-accent-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-ivory-200">Surat, Gujarat, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-sage-300/10">
              <LiveClock showLocation={true} />
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-forest-850/60 border border-sage-300/15 space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-wider text-accent-gold font-medium">
              COMMISSION AVAILABILITY
            </h4>
            <p className="font-sans text-sm text-sage-200 leading-relaxed">
              We take on a limited roster of 3–4 clients per quarter to ensure principal-level devotion to every detail.
            </p>
            <div className="flex items-center gap-2 font-mono text-xs text-ivory-200 pt-2">
              <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse"></span>
              <span>Currently booking Q2 & Q3 2026</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-7">
          {isSubmitted ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-forest-900 border border-accent-gold/40 text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-accent-gold/15 text-accent-gold flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-accent-gold font-semibold">
                  THANK YOU FOR REACHING OUT
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-white mt-1">
                  Inquiry Transmitted to Studio!
                </h3>
                <p className="font-sans text-sm text-sage-300 max-w-md mx-auto mt-2">
                  Your project brief has been logged and copied to your clipboard. Select your preferred channel below to connect with the studio.
                </p>
              </div>

              {/* Formatted Lead Summary Card */}
              <div className="bg-forest-950/80 p-5 rounded-2xl border border-sage-300/15 text-left font-mono text-xs space-y-2.5 max-w-lg mx-auto">
                <div className="flex items-center justify-between border-b border-sage-300/10 pb-2">
                  <span className="text-accent-gold font-semibold uppercase">DISPATCH RECEIPT</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> DELIVERED
                  </span>
                </div>
                <div className="text-sage-300 space-y-1 pt-1">
                  <p><span className="text-sage-400">Client:</span> <span className="text-ivory-200">{formData.name}</span></p>
                  <p><span className="text-sage-400">Mobile:</span> <span className="text-ivory-200">{formData.phone}</span></p>
                  <p><span className="text-sage-400">Email:</span> <span className="text-ivory-200">{formData.email}</span></p>
                  <p><span className="text-sage-400">Services:</span> <span className="text-accent-gold">{formData.projectTypes.join(', ')}</span></p>
                  <p className="pt-1 text-sage-400">Vision:</p>
                  <p className="text-ivory-200 italic font-sans bg-forest-900/60 p-2.5 rounded-lg border border-sage-300/10">
                    "{formData.message}"
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={getWhatsAppUrl(STUDIO_PHONE_NUMBER)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent-gold text-forest-950 hover:bg-ivory-100 font-mono text-xs uppercase font-semibold tracking-wider transition-all cursor-pointer shadow-md"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-forest-950" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href={getInquiryGmailUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-forest-800 border border-sage-300/20 text-ivory-200 hover:border-accent-gold hover:text-accent-gold font-mono text-xs uppercase font-semibold tracking-wider transition-all cursor-pointer shadow-md"
                >
                  <Mail className="w-3.5 h-3.5 text-accent-gold" />
                  <span>Send via Gmail Web</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-forest-950/90 border border-sage-300/20 text-ivory-200 hover:border-accent-gold hover:text-accent-gold font-mono text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-accent-gold" />
                      <span className="text-accent-gold font-bold">Copied Summary!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Brief Summary</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      phone: '',
                      email: '',
                      projectTypes: [],
                      message: '',
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-forest-950/80 border border-sage-300/15 text-sage-300 hover:text-ivory-200 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  <span>Send Another Inquiry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleEmailSubmit}
              className="p-8 sm:p-12 rounded-3xl bg-forest-900/90 border border-sage-300/15 space-y-8"
            >
              {/* Project Disciplines */}
              <div className="space-y-3">
                <label className="font-mono text-xs text-sage-300 uppercase tracking-wider block">
                  1. What services do you require? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {projectTypeOptions.map((type) => {
                    const isSelected = formData.projectTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleProjectType(type)}
                        className={`p-3.5 rounded-xl border text-left text-xs font-mono tracking-wider transition-all duration-300 flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-forest-800 border-accent-gold text-accent-gold shadow-[0_0_15px_rgba(216,195,158,0.12)]'
                            : 'bg-forest-950/60 border-sage-300/10 text-sage-300 hover:border-sage-300/30'
                        }`}
                      >
                        <span>{type}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-accent-gold" />}
                      </button>
                    );
                  })}
                </div>
                {errors.projectTypes && (
                  <p className="text-xs text-red-400 font-mono">{errors.projectTypes}</p>
                )}
              </div>

              {/* Name & Mobile Number Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-mono text-xs text-sage-300 uppercase tracking-wider block">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Julian Hayes"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-forest-950/80 border border-sage-300/15 text-ivory-200 placeholder-sage-400/50 focus:outline-none focus:border-accent-gold text-sm transition-colors"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400 font-mono">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-xs text-sage-300 uppercase tracking-wider block">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 88498 86332"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-forest-950/80 border border-sage-300/15 text-ivory-200 placeholder-sage-400/50 focus:outline-none focus:border-accent-gold text-sm transition-colors"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-400 font-mono">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Work Email Field */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-sage-300 uppercase tracking-wider block">
                  Work Email *
                </label>
                <input
                  type="email"
                  placeholder="e.g. julian@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-forest-950/80 border border-sage-300/15 text-ivory-200 placeholder-sage-400/50 focus:outline-none focus:border-accent-gold text-sm transition-colors"
                />
                {errors.email && (
                  <p className="text-xs text-red-400 font-mono">{errors.email}</p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-sage-300 uppercase tracking-wider block">
                  Project Vision & Context *
                </label>
                <textarea
                  rows={4}
                  placeholder="Share details about your brand, project objectives, and aspirations..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-forest-950/80 border border-sage-300/15 text-ivory-200 placeholder-sage-400/50 focus:outline-none focus:border-accent-gold text-sm transition-colors resize-none"
                />
                {errors.message && (
                  <p className="text-xs text-red-400 font-mono">{errors.message}</p>
                )}
              </div>

              {/* Dual Submit CTA Buttons (Email & WhatsApp) */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MagneticButton
                  type="submit"
                  disabled={isSubmitting}
                  variant="primary"
                  className="w-full !py-4 group"
                >
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-forest-950" />
                    <span>{isSubmitting ? 'Opening Gmail...' : 'Send via Email (Gmail)'}</span>
                  </span>
                  <Send className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                </MagneticButton>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleWhatsAppSubmit(STUDIO_PHONE_NUMBER)}
                  className="w-full py-4 px-6 rounded-full bg-forest-950/90 border border-sage-300/20 hover:border-accent-emerald text-ivory-100 hover:text-accent-emerald flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider transition-all duration-300 shadow-md group cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-accent-emerald" />
                  <span>Send via WhatsApp</span>
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      </div>
    </main>
  );
};



