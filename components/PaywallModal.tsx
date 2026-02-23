/**
 * PaywallModal — browser-only fallback preview.
 *
 * On native Android/iOS the RevenueCat native paywall sheet is presented
 * instead (via RevenueCatUI.presentPaywall). This modal is only shown when
 * running in a browser / dev server and cannot process real purchases.
 */
import React, { useState } from 'react';
import { X, Sparkles, CheckCircle, RotateCcw, Smartphone, Loader } from 'lucide-react';
import { restorePurchases } from '../services/purchases';

interface PaywallModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const BENEFITS = [
  'All 10 vet-backed training programs — unlock 7 more beyond the free tier',
  'Full sound library: specialized generators, classical & nature packs',
  'AI weekly behavior insights, unlimited log history & PDF vet reports',
  'Binaural theta, purring frequency & psychoacoustic music tracks',
];

export const PaywallModal: React.FC<PaywallModalProps> = ({ onClose, onSuccess }) => {
  const [restoring, setRestoring] = useState(false);
  const [restoreMsg, setRestoreMsg] = useState('');

  const handleRestore = async () => {
    setRestoring(true);
    setRestoreMsg('');
    const isPro = await restorePurchases();
    setRestoring(false);
    if (isPro) {
      onSuccess();
    } else {
      setRestoreMsg('No active Pro subscription found on this account.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl overflow-hidden">
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
          <h2 className="text-2xl font-bold mb-1">PetCalm Pro</h2>
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

          {/* Pricing summary */}
          <div className="flex gap-3 mb-5">
            <div className="flex-1 p-3 rounded-2xl border-2 border-primary bg-primary/5 text-left relative">
              <span className="absolute -top-2.5 left-3 text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                BEST VALUE
              </span>
              <div className="font-bold text-neutral-text text-sm">Annual</div>
              <div className="text-lg font-bold text-primary">$34.99<span className="text-xs font-normal text-neutral-400">/yr</span></div>
              <div className="text-[11px] text-status-success font-medium">7-day free trial · Save 42%</div>
            </div>
            <div className="flex-1 p-3 rounded-2xl border-2 border-neutral-200 bg-white text-left">
              <div className="font-bold text-neutral-text text-sm">Monthly</div>
              <div className="text-lg font-bold text-primary">$4.99<span className="text-xs font-normal text-neutral-400">/mo</span></div>
              <div className="text-[11px] text-neutral-400">Cancel anytime</div>
            </div>
          </div>

          {/* Device-only notice */}
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-5">
            <Smartphone size={20} className="text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-800 leading-snug">
              <strong>Purchases available on your device.</strong> Install the app on Android to subscribe via Google Play.
            </p>
          </div>

          {/* Restore & close */}
          <div className="flex justify-between items-center pb-2">
            <button
              onClick={handleRestore}
              disabled={restoring}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {restoring
                ? <Loader size={12} className="animate-spin" />
                : <RotateCcw size={12} />}
              {restoring ? 'Checking…' : 'Restore Purchases'}
            </button>
            <button onClick={onClose} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
              Continue with Free
            </button>
          </div>

          {restoreMsg && (
            <p className="text-center text-xs text-red-500 mt-2">{restoreMsg}</p>
          )}
        </div>
      </div>
    </div>
  );
};
