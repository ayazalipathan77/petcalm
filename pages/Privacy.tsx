import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  content: string;
}

const sections: Section[] = [
  {
    id: 'data',
    title: 'What Data We Collect',
    content:
      'PetCalm stores the following data exclusively on your device: pet profile information (name, breed, age, photo), behavior incident logs, daily mood entries, training progress, schedule items, and reminders. No data is transmitted to our servers or any third party, except when you choose to use the AI Insights feature (see below).',
  },
  {
    id: 'storage',
    title: 'How Data Is Stored',
    content:
      'All app data is stored locally in your device\'s IndexedDB (a browser-based database). Your data never leaves your device unless you explicitly use AI Insights. You can delete all data at any time using the "Reset Pet & Start Over" option in the Profile screen.',
  },
  {
    id: 'ai',
    title: 'AI Insights & Third-Party Services',
    content:
      'When you tap "Generate AI Insights" in the Behavior Log screen, a summary of your recent behavior incidents (not photos or personally identifiable information) is sent to Google\'s Gemini API to generate training recommendations. This transmission is subject to Google\'s Privacy Policy. If you do not use AI Insights, no data is ever sent anywhere.',
  },
  {
    id: 'photos',
    title: 'Pet Photos',
    content:
      'If you upload a pet photo, it is converted to a base64 string and stored only in your device\'s local database. Photos are never uploaded to any server. You can remove the photo at any time by selecting an emoji avatar in the Profile screen.',
  },
  {
    id: 'permissions',
    title: 'Device Permissions',
    content:
      'PetCalm may request the following permissions:\n\n• Notifications — to send reminder alerts you have scheduled. Notifications are generated locally on your device; no remote server is involved.\n\n• Camera / Photo Library — only if you choose to upload a pet photo. The image is stored locally and not uploaded.',
  },
  {
    id: 'children',
    title: 'Children\'s Privacy',
    content:
      'PetCalm is not directed to children under 13. We do not knowingly collect any personal information from children.',
  },
  {
    id: 'contact',
    title: 'Contact Us',
    content:
      'If you have questions about this Privacy Policy, please contact us at: privacy@petcalm.app\n\nLast updated: February 2026',
  },
];

export const Privacy: React.FC = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ data: true });

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="pb-24 pt-6 px-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield size={20} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-text">Privacy Policy</h1>
          <p className="text-xs text-neutral-subtext">Your data stays on your device</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar -mx-6 px-6 pb-6 space-y-3">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-4">
          <p className="text-sm text-primary font-medium">
            PetCalm is a privacy-first app. All your pet's data lives on your device only — we do not have servers that store your information.
          </p>
        </div>

        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <button
              onClick={() => toggle(section.id)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="font-semibold text-sm text-neutral-text">{section.title}</span>
              {expanded[section.id] ? (
                <ChevronUp size={18} className="text-neutral-subtext flex-shrink-0" />
              ) : (
                <ChevronDown size={18} className="text-neutral-subtext flex-shrink-0" />
              )}
            </button>
            {expanded[section.id] && (
              <div className="px-4 pb-4">
                <p className="text-sm text-neutral-subtext whitespace-pre-line leading-relaxed">
                  {section.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
