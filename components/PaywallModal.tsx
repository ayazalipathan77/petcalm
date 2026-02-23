import React, { useState } from 'react';
import { X, Sparkles, CheckCircle, RotateCcw, Loader } from 'lucide-react';
import { purchasePackageById, restorePurchases } from '../services/purchases';

interface PaywallModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const BENEFITS = [
  'All 10 vet-backed training programs — unlock 7 more beyond the free tier',
  'Full sound library: specialized generators, classical & nature packs',
  'AI weekly behavior insights, unlimited log history & PDF vet reports',
];

export const PaywallModal: React.FC<PaywallModalProps> = ({ onClose, onSuccess }) => {
  const [plan, setPlan] = useState<'annual' | 'monthly'>('annual');
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    const packageId = plan === 'annual' ? '$rc_annual' : '$rc_monthly';
    const success = await purchasePackageById(packageId);
    setLoading(false);
    if (success) onSuccess();
  };

  const handleRestore = async () => {
    setRestoring(true);
    const isPro = await restorePurchases();
    setRestoring(false);
    if (isPro) {
      onSuccess();
    } else {
      alert('No active Pro subscription found on this account.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors z-10"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary-dark px-6 pt-8 pb-6 text-white text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Sparkles size={28} />
          </div>
          <h2 className="text-2xl font-bold mb-1">Upgrade to Pro</h2>
          <p className="text-sm text-white/80">Everything your anxious pet needs, unlocked</p>
        </div>

        <div className="px-6 py-5">
          {/* Benefits */}
          <ul className="space-y-3 mb-6">
            {BENEFITS.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-700 leading-snug">{b}</span>
              </li>
            ))}
          </ul>

          {/* Plan toggle */}
          <div className="flex gap-3 mb-4">
            {/* Annual */}
            <button
              onClick={() => setPlan('annual')}
              className={`flex-1 p-3 rounded-2xl border-2 text-left transition-all relative ${
                plan === 'annual' ? 'border-primary bg-primary/5' : 'border-neutral-200 bg-white'
              }`}
            >
              {plan === 'annual' && (
                <span className="absolute -top-2.5 left-3 text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                  BEST VALUE
                </span>
              )}
              <div className="font-bold text-neutral-text text-sm">Annual</div>
              <div className="text-lg font-bold text-primary">$34.99<span className="text-xs font-normal text-neutral-400">/yr</span></div>
              <div className="text-[11px] text-status-success font-medium">7-day free trial · Save 42%</div>
            </button>

            {/* Monthly */}
            <button
              onClick={() => setPlan('monthly')}
              className={`flex-1 p-3 rounded-2xl border-2 text-left transition-all ${
                plan === 'monthly' ? 'border-primary bg-primary/5' : 'border-neutral-200 bg-white'
              }`}
            >
              <div className="font-bold text-neutral-text text-sm">Monthly</div>
              <div className="text-lg font-bold text-primary">$4.99<span className="text-xs font-normal text-neutral-400">/mo</span></div>
              <div className="text-[11px] text-neutral-400">Cancel anytime</div>
            </button>
          </div>

          {/* CTA */}
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {loading ? (
              <><Loader size={18} className="animate-spin" /> Processing…</>
            ) : (
              plan === 'annual' ? 'Start 7-Day Free Trial' : 'Start Pro — $4.99/mo'
            )}
          </button>

          {/* Restore + close */}
          <div className="flex justify-between mt-4 pb-2">
            <button
              onClick={handleRestore}
              disabled={restoring}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <RotateCcw size={12} />
              {restoring ? 'Checking…' : 'Restore Purchases'}
            </button>
            <button onClick={onClose} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
              Continue with Free
            </button>
          </div>

          <p className="text-center text-[10px] text-neutral-300 mt-2">
            Billed via Google Play. Cancel anytime in Play Store settings.
          </p>
        </div>
      </div>
    </div>
  );
};
