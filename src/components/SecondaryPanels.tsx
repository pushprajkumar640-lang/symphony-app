import React, { useState } from 'react';
import { Check, Send, HelpCircle, Download, Monitor, Smartphone, Sparkles, MessageSquare } from 'lucide-react';

/* ============================================================================
   PREMIUM PANEL
   ============================================================================ */
export function PremiumPanel() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Symphony Free',
      price: '$0.00',
      period: 'forever',
      features: [
        'Ad-supported audio playback',
        'Streaming synth visuals',
        'Standard sound synthesis quality',
        'Access to standard playlists'
      ],
      cta: 'Current Plan',
      popular: false,
    },
    {
      id: 'premium',
      name: 'Symphony Premium',
      price: '$4.99',
      period: 'month',
      features: [
        'Ad-free uninterrupted playback',
        'Ultra high-quality synth bitrates',
        'Unlock all advanced audio filters',
        'Unlimited custom playlist creations',
        'Offline caching mode support'
      ],
      cta: 'Upgrade Now',
      popular: true,
    },
    {
      id: 'family',
      name: 'Symphony Family',
      price: '$9.99',
      period: 'month',
      features: [
        'Up to 6 accounts for family members',
        'Personalized profiles for everyone',
        'Premium parental controls filter',
        'Ad-free playback & download modules',
        'Symphony kids application bundle'
      ],
      cta: 'Get Family',
      popular: false,
    }
  ];

  return (
    <div className="flex flex-col gap-8 text-white max-w-5xl mx-auto py-4" id="premium-panel">
      <div className="text-center flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8B54D]/10 text-[#E8B54D] text-xs font-semibold self-center">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Elevate Your Listening Experience</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">Symphony Premium Plans</h1>
        <p className="text-gray-400 max-w-lg mx-auto text-sm">
          Listen without limits. Pure audio rendering, offline downloads, and advanced acoustic visualizers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative flex flex-col gap-6 p-6 rounded-2xl border transition-all duration-300 ${
              plan.popular 
                ? 'bg-gradient-to-b from-[#222] to-[#181818] border-[#E8B54D] shadow-xl shadow-[#E8B54D]/5 scale-105 z-10' 
                : 'bg-[#181818] border-[#282828] hover:border-[#383838]'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#E8B54D] text-[#121212] text-[10px] font-extrabold uppercase tracking-wider rounded-full">
                Most Popular
              </span>
            )}

            <div>
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                <span className="text-gray-400 text-xs">/ {plan.period}</span>
              </div>
            </div>

            <ul className="flex flex-col gap-3 my-2 flex-1">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-[#E8B54D] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                setSelectedPlan(plan.id);
                alert(`Thank you for choosing ${plan.name}! This is a demo subscription integration.`);
              }}
              className={`w-full py-3 rounded-full text-center font-bold text-xs transition-transform active:scale-95 ${
                plan.popular
                  ? 'bg-[#E8B54D] text-[#121212] hover:bg-[#f0c568]'
                  : 'bg-[#242424] text-white hover:bg-[#2a2a2a] border border-[#383838]'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   SUPPORT PANEL
   ============================================================================ */
export function SupportPanel() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      alert('Please enter your email and message.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
      alert('Support ticket submitted successfully! We will get back to you shortly.');
    }, 1500);
  };

  const faqs = [
    { q: 'How does the Symphony audio engine work?', a: 'Symphony uses a sophisticated client-side Web Audio synthesis framework. When you hit play, it dynamically compiles and synthesizes real waveform patterns in your browser. This yields zero network lag, runs completely offline, and connects directly to our graphic visualizer node.' },
    { q: 'Can I connect my real premium account?', a: 'Yes! Symphony integrates standard Firebase backend services. If configured with production keys, you can log in, register, and save your custom library and playlists safely across browsers.' },
    { q: 'How do I add a new song to my custom playlists?', a: 'Click the "+ Create" button on the library sidebar to define your custom playlist, then search or browse trending songs and click the heart/add icon on any music card to insert it directly.' }
  ];

  return (
    <div className="flex flex-col gap-8 text-white max-w-4xl mx-auto py-4" id="support-panel">
      <div className="text-center flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Symphony Customer Help Center</h1>
        <p className="text-gray-400 text-sm">
          Have a question about our Web Audio synthesizer, accounts, or playlists? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        {/* Contact Form */}
        <div className="p-6 bg-[#181818] rounded-2xl border border-[#282828] flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[#282828] pb-3">
            <MessageSquare className="w-5 h-5 text-[#E8B54D]" />
            <h2 className="text-lg font-bold">Submit a Help Ticket</h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400">Your Name</label>
              <input 
                type="text" 
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#242424] border border-[#282828] text-white text-xs rounded-lg focus:outline-none focus:border-[#E8B54D] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400">Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#242424] border border-[#282828] text-white text-xs rounded-lg focus:outline-none focus:border-[#E8B54D] transition-colors"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400">Describe the issue</label>
              <textarea 
                rows={4}
                placeholder="How can we assist you today?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#242424] border border-[#282828] text-white text-xs rounded-lg focus:outline-none focus:border-[#E8B54D] resize-none transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitted}
              className="mt-2 w-full py-3 bg-[#E8B54D] hover:bg-[#f0c568] disabled:bg-gray-600 text-[#121212] font-bold text-xs rounded-full flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitted ? 'Submitting...' : 'Send Message'}</span>
            </button>
          </form>
        </div>

        {/* FAQs */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-[#282828] pb-3">
            <HelpCircle className="w-5 h-5 text-[#E8B54D]" />
            <h2 className="text-lg font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 bg-[#181818] rounded-xl border border-[#282828] flex flex-col gap-2">
                <h4 className="text-sm font-bold text-[#E8B54D]">{faq.q}</h4>
                <p className="text-xs text-gray-300 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   DOWNLOAD PANEL
   ============================================================================ */
export function DownloadPanel() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const platforms = [
    { id: 'win', name: 'Windows Desktop Client', icon: Monitor, version: 'v2.4.1', size: '78 MB' },
    { id: 'mac', name: 'macOS Apple Silicon / Intel', icon: Monitor, version: 'v2.4.1', size: '84 MB' },
    { id: 'ios', name: 'iOS App Store Client', icon: Smartphone, version: 'v2.4.0', size: '42 MB' },
    { id: 'apk', name: 'Android APK / Google Play', icon: Smartphone, version: 'v2.4.0', size: '49 MB' },
  ];

  const handleDownload = (id: string, name: string) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      alert(`Symphony ${name} package compilation initiated! The download will start automatically once package assembly finishes.`);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8 text-white max-w-4xl mx-auto py-4" id="download-panel">
      <div className="text-center flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Download Symphony Apps</h1>
        <p className="text-gray-400 text-sm">
          Listen flawlessly on any machine. Fully native desktop apps, offline local support, and background controls.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {platforms.map((plat) => {
          const IconComp = plat.icon;
          const isThisDownloading = downloading === plat.id;

          return (
            <div key={plat.id} className="p-5 bg-[#181818] rounded-xl border border-[#282828] flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#242424] rounded-xl border border-[#282828] text-[#E8B54D]">
                  <IconComp className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{plat.name}</h4>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Stable Version {plat.version} • {plat.size}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDownload(plat.id, plat.name)}
                disabled={downloading !== null}
                className="p-2.5 rounded-full bg-[#242424] hover:bg-[#E8B54D] hover:text-[#121212] border border-[#282828] text-[#E8B54D] transition-all disabled:bg-gray-700 disabled:text-gray-400"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
