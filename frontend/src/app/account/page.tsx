'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ApiClient } from '@/patterns/api/AbstractApiClientFactory';
import { useToast } from '@/context/ToastContext';
import { Award, Gift, Sparkles, ArrowLeft, Copy, Check, Shield, Star, LogOut } from 'lucide-react';

export default function AccountLoyaltyPage() {
  const { user, token, logout } = useAuth();
  const { showToast } = useToast();
  const [loyalty, setLoyalty] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [redeeming, setRedeeming] = useState<number | null>(null);

  const loadProfile = async () => {
    if (token) {
      setLoading(true);
      const res = await ApiClient.getLoyaltyProfile(token);
      if (res && res.loyalty) {
        setLoyalty(res.loyalty);
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [token]);

  const handleRedeem = async (pointsNeeded: number, discountAmount: number) => {
    if (!token) return;
    setRedeeming(pointsNeeded);
    const res = await ApiClient.redeemLoyaltyPoints(token, pointsNeeded, discountAmount);
    setRedeeming(null);

    if (res.success) {
      showToast(`Privilege Unlocked! Code: ${res.couponCode} 🎉`);
      loadProfile();
    } else {
      showToast(res.message || 'Error redeeming points', 'error');
    }
  };

  const handleCopyReferral = () => {
    if (loyalty?.referralCode) {
      navigator.clipboard.writeText(`https://odoratus.com/register?ref=${loyalty.referralCode}`);
      setCopied(true);
      showToast('Referral invitation link copied to clipboard ✨');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!user && !loading) {
    return (
      <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] py-24 min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <div className="w-16 h-16 border border-[#b38b4d]/40 flex items-center justify-center text-[#8c6d3b] dark:text-[#c29b62] mx-auto mb-2 bg-white dark:bg-[#141211]">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl text-[#1a1816] dark:text-white">Maison VIP Privilege</h2>
          <p className="text-xs text-[#7a746e] dark:text-[#a6a096]">
            Sign in to access your Atelier Points balance, VIP membership tier, and exclusive privilege vouchers.
          </p>
          <div className="flex justify-center gap-3 pt-4">
            <Link href="/auth/login">
              <button className="px-6 py-3 bg-[#1a1816] hover:bg-[#b38b4d] text-white dark:bg-white dark:text-black text-xs uppercase tracking-wider font-semibold transition-colors">
                Sign In
              </button>
            </Link>
            <Link href="/auth/register">
              <button className="px-6 py-3 border border-[#1a1816] dark:border-white/20 text-xs uppercase tracking-wider font-semibold">
                Join The Maison
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] py-12 min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb & User Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e2d4] dark:border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096] mb-1">
              <Link href="/" className="hover:text-[#b38b4d] flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Maison Home
              </Link>
              <span>/</span>
              <span className="text-[#8c6d3b] dark:text-[#c29b62] font-semibold">VIP Privilege Account</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1a1816] dark:text-white font-normal">
              Welcome, {user?.name}
            </h1>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 border border-[#e8e2d4] dark:border-white/10 text-[#7a746e] hover:text-rose-600 text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tier & Points Overview Banner */}
        <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8c6d3b] dark:text-[#c29b62] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Current Membership Standing</span>
            </span>
            <div className="font-serif text-3xl sm:text-4xl text-[#1a1816] dark:text-white flex items-center gap-3">
              <span>{loyalty?.tier || 'Bronze'} Member</span>
              <span className="text-xs bg-[#b38b4d] text-white px-2.5 py-0.5 font-sans font-bold">
                Tier Verified
              </span>
            </div>
            <p className="text-xs text-[#7a746e] dark:text-[#a6a096] leading-relaxed">
              Earn 10 Atelier Points for every $1 spent. Redeem for private discount codes and rare discovery miniature flights.
            </p>
          </div>

          <div className="md:col-span-5 bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 p-6 text-center space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096] block">
              Available Atelier Points
            </span>
            <div className="font-serif text-4xl sm:text-5xl font-bold text-[#8c6d3b] dark:text-[#c29b62]">
              {loyalty?.points ?? 150}
            </div>
            <span className="text-[10px] text-[#7a746e] dark:text-[#a6a096] block">
              Worth up to $25+ in bespoke discounts
            </span>
          </div>
        </div>

        {/* Redeemable Rewards Cards */}
        <div className="space-y-4">
          <h3 className="font-serif text-2xl text-[#1a1816] dark:text-white font-normal flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#8c6d3b] dark:text-[#c29b62]" />
            <span>Redeem Points for Privilege Codes</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(loyalty?.redeemableRewards || [
              { pointsNeeded: 200, discount: '$25 Off Your Next Flacon', code: 'REWARD25' },
              { pointsNeeded: 400, discount: '$60 Off + Complimentary 10ml Travel Spray', code: 'REWARD60' },
              { pointsNeeded: 800, discount: 'Complimentary Discovery Flight (5x10ml)', code: 'REWARDVIP' }
            ]).map((rw: any) => {
              const canRedeem = (loyalty?.points ?? 150) >= rw.pointsNeeded;
              return (
                <div
                  key={rw.pointsNeeded}
                  className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-5 flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8c6d3b] dark:text-[#c29b62] font-semibold block mb-1">
                      {rw.pointsNeeded} Atelier Points
                    </span>
                    <h4 className="font-serif text-lg text-[#1a1816] dark:text-white font-medium">
                      {rw.discount}
                    </h4>
                  </div>

                  <button
                    disabled={!canRedeem || redeeming === rw.pointsNeeded}
                    onClick={() => handleRedeem(rw.pointsNeeded, rw.pointsNeeded === 200 ? 25 : rw.pointsNeeded === 400 ? 60 : 100)}
                    className={`w-full py-2.5 text-xs uppercase tracking-wider font-semibold transition-colors ${
                      canRedeem
                        ? 'bg-[#1a1816] hover:bg-[#b38b4d] text-white dark:bg-white dark:text-black'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    {redeeming === rw.pointsNeeded ? 'Unlocking...' : canRedeem ? 'Redeem Voucher' : `Needs ${rw.pointsNeeded - (loyalty?.points ?? 150)} More Pts`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* VIP Referral Program Card */}
        <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8c6d3b] dark:text-[#c29b62] font-semibold block">
            Maison Invitation Circle
          </span>
          <h3 className="font-serif text-2xl text-[#1a1816] dark:text-white font-normal">
            Invite a Fellow Connoisseur
          </h3>
          <p className="text-xs text-[#7a746e] dark:text-[#a6a096] max-w-xl leading-relaxed">
            Share your unique invitation link. When an invited guest acquires their first flacon, both of you receive <strong>200 bonus Atelier Points</strong> ($25 value).
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md">
            <input
              type="text"
              readOnly
              value={`https://odoratus.com/register?ref=${loyalty?.referralCode || 'ODR-VIP'}`}
              className="flex-1 bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 px-3 py-2 text-xs font-mono text-[#1a1816] dark:text-white"
            />
            <button
              onClick={handleCopyReferral}
              className="px-5 py-2 bg-[#1a1816] hover:bg-[#b38b4d] text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
