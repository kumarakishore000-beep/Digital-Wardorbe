'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Phone, Mail, MessageSquare, MapPin, Clock, Calendar, 
  CheckCircle2, Sparkles, ArrowRight, User, Send, ShieldCheck,
  Bot, Radio, ChevronRight
} from 'lucide-react';
import AuraStyleLogo from '@/components/AuraStyleLogo';

export default function TalkWithUsPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    occasion: 'Job Interview & Career Assessment',
    channel: 'WhatsApp Consultation',
    preferredDate: '',
    notes: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockId = `AURA-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingId(mockId);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0a192f] text-[#FAF8F5] selection:bg-[#1e3a8a] selection:text-[#fffff0]">
      {/* Top Navigation */}
      <header className="w-full flex items-center justify-between px-6 py-4 bg-[#0a192f]/90 backdrop-blur-xl border-b border-[#FAF8F5]/15 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3 group">
          <AuraStyleLogo variant="mark" size="md" />
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-black tracking-tight text-[#FAF8F5] group-hover:text-[#93c5fd] transition-colors">
              AuraStyle <span className="font-sans text-xs tracking-widest uppercase text-[#38BDF8] font-bold">AI</span>
            </h1>
            <p className="text-[11px] text-[#93c5fd] font-serif italic font-light">Atelier Styling Concierge</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#FAF8F5]/20 bg-[#1e3a8a]/40 text-[#FAF8F5] hover:bg-[#1e3a8a] text-xs font-semibold shadow-sm transition-all"
          >
            <span>Open AI Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e3a8a]/30 border border-[#FAF8F5]/20 text-xs text-[#FAF8F5] uppercase tracking-widest font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            Personal Styling Concierge &bull; Human & AI
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-[#FAF8F5]">
            Talk with Our Stylists
          </h1>
          <p className="text-base md:text-lg text-[#FAF8F5]/75 leading-relaxed">
            Whether you are curating a flawless wardrobe for a high-stakes executive interview, preparing for a destination wedding, or need bespoke tailoring advice, our master stylists and atelier team are here to assist.
          </p>
        </div>

        {/* Quick Options Grid: Talk to AI / Chat with AI / Talk to Human Stylist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Chat with AI */}
          <div className="bg-[#050d1a]/80 border border-[#FAF8F5]/15 rounded-3xl p-6 flex flex-col justify-between space-y-6 hover:border-[#38BDF8]/40 transition-all group shadow-xl">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1e3a8a] flex items-center justify-center text-white shadow-md">
                <Bot className="w-6 h-6 text-[#38BDF8]" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#FAF8F5]">Chat with AI Stylist</h3>
              <p className="text-xs text-[#FAF8F5]/70 leading-relaxed">
                Instant conversational fashion critique, fabric science, and 5-piece accessories guidance available 24/7.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#0a192f] border border-[#FAF8F5]/20 hover:border-[#38BDF8] text-xs font-semibold text-white group-hover:bg-[#1e3a8a]/40 transition-all"
            >
              <span>Start AI Text Chat</span>
              <ChevronRight className="w-4 h-4 text-[#38BDF8]" />
            </Link>
          </div>

          {/* Card 2: Talk to AI (Voice) */}
          <div className="bg-[#050d1a]/80 border border-[#38BDF8]/30 rounded-3xl p-6 flex flex-col justify-between space-y-6 hover:border-[#38BDF8] transition-all group shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-[#1e3a8a] to-[#38BDF8] text-[10px] font-mono font-bold rounded-bl-xl text-white">
              POPULAR
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1e3a8a] to-[#38BDF8] flex items-center justify-center text-white shadow-md">
                <Radio className="w-6 h-6 text-white animate-pulse" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#FAF8F5]">Talk to AI (Voice)</h3>
              <p className="text-xs text-[#FAF8F5]/70 leading-relaxed">
                Speak directly through your microphone and receive natural spoken voice fashion advice with zero typing.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#38BDF8] text-xs font-bold text-white transition-all shadow-md hover:scale-[1.02]"
            >
              <span>Launch Voice Mode</span>
              <Radio className="w-3.5 h-3.5 text-amber-200" />
            </Link>
          </div>

          {/* Card 3: Direct WhatsApp Concierge */}
          <div className="bg-[#050d1a]/80 border border-[#FAF8F5]/15 rounded-3xl p-6 flex flex-col justify-between space-y-6 hover:border-emerald-500/40 transition-all group shadow-xl">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#FAF8F5]">WhatsApp VIP Desk</h3>
              <p className="text-xs text-[#FAF8F5]/70 leading-relaxed">
                Connect directly with our master stylists on WhatsApp for urgent event styling or bridal consultation.
              </p>
            </div>
            <a
              href="https://wa.me/18002872789?text=Hello%20AuraStyle%20Stylist,%20I%20would%20like%20a%20personal%20styling%20consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/40 text-xs font-semibold text-emerald-300 transition-all"
            >
              <span>Open WhatsApp Chat</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Main Consultation Booking Section & Contact Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#050d1a]/95 border border-[#FAF8F5]/15 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-[#FAF8F5]/10 pb-4">
                  <h2 className="text-2xl font-serif font-bold text-[#FAF8F5]">
                    Request a 1-on-1 Consultation
                  </h2>
                  <p className="text-xs text-[#FAF8F5]/60 mt-1">
                    Fill out the brief below and our bespoke concierge will connect within 2 hours.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#FAF8F5]/70 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Eleanor Vance"
                      className="w-full bg-[#0a192f] border border-[#FAF8F5]/15 focus:border-[#38BDF8] rounded-xl px-4 py-2.5 text-sm text-[#FAF8F5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#FAF8F5]/70 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="eleanor@vance.com"
                      className="w-full bg-[#0a192f] border border-[#FAF8F5]/15 focus:border-[#38BDF8] rounded-xl px-4 py-2.5 text-sm text-[#FAF8F5] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#FAF8F5]/70 mb-1.5">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 019-2834"
                      className="w-full bg-[#0a192f] border border-[#FAF8F5]/15 focus:border-[#38BDF8] rounded-xl px-4 py-2.5 text-sm text-[#FAF8F5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#FAF8F5]/70 mb-1.5">
                      Preferred Channel
                    </label>
                    <select
                      value={formData.channel}
                      onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                      className="w-full bg-[#0a192f] border border-[#FAF8F5]/15 focus:border-[#38BDF8] rounded-xl px-4 py-2.5 text-sm text-[#FAF8F5] outline-none"
                    >
                      <option value="WhatsApp Consultation">WhatsApp Concierge</option>
                      <option value="Phone Call">Direct Phone Call</option>
                      <option value="Google Meet / Video">Video Call (Google Meet)</option>
                      <option value="Email Styling Brief">Email Styling Dossier</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#FAF8F5]/70 mb-1.5">
                      Styling Occasion *
                    </label>
                    <select
                      value={formData.occasion}
                      onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                      className="w-full bg-[#0a192f] border border-[#FAF8F5]/15 focus:border-[#38BDF8] rounded-xl px-4 py-2.5 text-sm text-[#FAF8F5] outline-none"
                    >
                      <option value="Job Interview & Career Assessment">Job Interview & Executive Presence</option>
                      <option value="Luxury Wedding & Gala Reception">Luxury Wedding & Gala Reception</option>
                      <option value="Red Carpet & Black-Tie Gala">Red Carpet & Black-Tie Gala</option>
                      <option value="Seasonal Wardrobe Overhaul">Seasonal Wardrobe Overhaul</option>
                      <option value="Bespoke Made-to-Measure Suiting">Bespoke Made-to-Measure Suiting</option>
                      <option value="5-Piece Jewelry & Accessory Styling">5-Piece Jewelry & Accessory Styling</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#FAF8F5]/70 mb-1.5">
                      Target Event Date
                    </label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full bg-[#0a192f] border border-[#FAF8F5]/15 focus:border-[#38BDF8] rounded-xl px-4 py-2.5 text-sm text-[#FAF8F5] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#FAF8F5]/70 mb-1.5">
                    Specific Style Questions, Fabric Preferences, or Fit Goals
                  </label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="E.g., I have a final round interview for a Director role next Tuesday. I want advice on whether a navy wool suit or charcoal blazer is best, and what shoes and watch to pair with it."
                    className="w-full bg-[#0a192f] border border-[#FAF8F5]/15 focus:border-[#38BDF8] rounded-xl p-4 text-sm text-[#FAF8F5] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FAF8F5] hover:bg-white text-[#0a192f] font-bold py-3.5 px-6 rounded-2xl transition-all duration-300 shadow-xl shadow-[#1e3a8a]/30 flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4 text-[#1e3a8a]" />
                  <span>Submit Consultation Request</span>
                </button>

                <p className="text-[11px] text-center text-[#FAF8F5]/50 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Your privacy is protected. Consultations are confidential and tailored exclusively for you.
                </p>
              </form>
            ) : (
              <div className="text-center py-12 space-y-6 animate-in fade-in duration-500">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-2xl text-[#FAF8F5]">
                    Consultation Request Confirmed!
                  </h3>
                  <p className="text-sm text-[#FAF8F5]/75 max-w-md mx-auto">
                    Thank you, <strong className="text-white">{formData.fullName}</strong>. Our senior styling team has received your brief for <strong className="text-[#38BDF8]">{formData.occasion}</strong>.
                  </p>
                </div>

                <div className="p-4 bg-[#0a192f] rounded-2xl border border-[#FAF8F5]/15 max-w-sm mx-auto text-left space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#FAF8F5]/60">Booking Reference:</span>
                    <span className="font-mono font-bold text-[#38BDF8]">{bookingId}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#FAF8F5]/60">Communication Channel:</span>
                    <span className="font-semibold text-white">{formData.channel}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#FAF8F5]/60">Expected Response:</span>
                    <span className="text-emerald-300 font-semibold">&lt; 2 Hours</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 rounded-full bg-[#FAF8F5] text-[#0a192f] font-bold text-xs hover:bg-white transition-all shadow-md"
                  >
                    Open AI Wardrobe Studio
                  </Link>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        fullName: '',
                        email: '',
                        phone: '',
                        occasion: 'Job Interview & Career Assessment',
                        channel: 'WhatsApp Consultation',
                        preferredDate: '',
                        notes: '',
                      });
                    }}
                    className="px-6 py-3 rounded-full bg-[#1e3a8a]/40 text-[#FAF8F5] text-xs hover:bg-[#1e3a8a] transition-all border border-[#FAF8F5]/20"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Atelier Info & Direct Contacts (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact details card */}
            <div className="bg-[#050d1a]/80 border border-[#FAF8F5]/15 rounded-3xl p-6 space-y-6">
              <h3 className="font-serif font-bold text-xl text-[#FAF8F5] border-b border-[#FAF8F5]/10 pb-3">
                Atelier Concierge Direct
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#FAF8F5]">VIP Concierge Hotline</p>
                    <p className="text-[#FAF8F5]/70">+1 (800) 287-2789 &bull; +91 80 4920 7000</p>
                    <p className="text-[10px] text-[#FAF8F5]/50">Toll-free 24/7 dedicated line</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#FAF8F5]">Senior Styling Desk</p>
                    <p className="text-[#FAF8F5]/70">concierge@aurastyle.ai</p>
                    <p className="text-[10px] text-[#FAF8F5]/50">Guaranteed response within 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#FAF8F5]">Studio Consultations</p>
                    <p className="text-[#FAF8F5]/70">Monday &ndash; Saturday: 9:00 AM &ndash; 9:00 PM EST</p>
                    <p className="text-[10px] text-[#FAF8F5]/50">Sunday: Reserved for Bridal & Wedding appointments</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Atelier Studios Locations */}
            <div className="bg-[#050d1a]/80 border border-[#FAF8F5]/15 rounded-3xl p-6 space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#FAF8F5] border-b border-[#FAF8F5]/10 pb-2">
                Flagship Atelier Locations
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#FAF8F5]/50 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Paris Couture Studio</p>
                    <p className="text-[#FAF8F5]/60">24 Rue du Faubourg Saint-Honoré, 75008 Paris</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#FAF8F5]/50 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">New York Bespoke Lounge</p>
                    <p className="text-[#FAF8F5]/60">650 Madison Avenue, New York, NY 10022</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#FAF8F5]/50 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Bengaluru Tech & Luxury Atelier</p>
                    <p className="text-[#FAF8F5]/60">UB City, Vittal Mallya Road, Bengaluru 560001</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#FAF8F5]/10 py-8 px-4 bg-[#050d1a] mt-20">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF8F5]/60">
          <AuraStyleLogo variant="full" />
          <p>&copy; {new Date().getFullYear()} AuraStyle AI. All rights reserved. Dressed for your moments.</p>
        </div>
      </footer>
    </div>
  );
}
