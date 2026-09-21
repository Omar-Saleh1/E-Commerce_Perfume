'use client';
import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export const AtelierChronicles = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    showToast('Welcome to the Odoratus Atelier circle ✨');
  };

  return (
    <section className="py-20 bg-[#f8f6f0] dark:bg-[#0d0c0b] border-b border-[#e8e2d4] dark:border-white/10 text-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#8c6d3b] dark:text-[#c29b62] font-semibold block mb-2 font-sans">
          The Private Circle
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1a1816] dark:text-[#f8f6f0] tracking-tight mb-4">
          Atelier Chronicles
        </h2>
        <p className="text-xs sm:text-sm text-[#7a746e] dark:text-[#a6a096] font-sans max-w-lg mx-auto leading-relaxed mb-8">
          Receive private invitations to limited seasonal distillations, private harvests in Grasse, and rare raw material releases before public launch.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#f3efe6] dark:bg-[#1a1816] border border-[#b38b4d] text-[#8c6d3b] dark:text-[#c29b62] text-xs font-semibold uppercase tracking-wider">
            <Check className="w-4 h-4 text-[#8c6d3b]" />
            <span>Invitation Confirmed • Merci Beaucoup</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
            <div className="relative w-full">
              <Mail className="w-4 h-4 text-[#7a746e] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 pl-10 pr-4 py-3.5 text-xs text-[#1a1816] dark:text-[#f8f6f0] placeholder-[#7a746e] focus:outline-none focus:border-[#b38b4d]"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#1a1816] hover:bg-[#b38b4d] text-white dark:bg-[#f8f6f0] dark:hover:bg-[#c29b62] dark:text-black text-xs uppercase tracking-[0.2em] font-semibold transition-all whitespace-nowrap shadow-sm"
            >
              Subscribe
            </button>
          </form>
        )}

      </div>
    </section>
  );
};
