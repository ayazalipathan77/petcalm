import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, Pill, Stethoscope, Puzzle, Brain, Crown } from 'lucide-react';
import { usePro } from '../context/ProContext';

interface GuideCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  evidence: 'Strong' | 'Moderate' | 'Limited';
  summary: string;
  detail: string;
}

const GUIDE_SECTIONS: { title: string; proOnly?: boolean; cards: GuideCard[] }[] = [
  {
    title: 'Pheromone Therapy',
    cards: [
      {
        id: 'adaptil',
        title: 'Adaptil (Dogs)',
        icon: <Shield size={20} />,
        evidence: 'Strong',
        summary: 'Synthetic dog-appeasing pheromone (DAP) that mimics the calming pheromone nursing mothers produce.',
        detail: 'Available as diffuser, collar, or spray. Place diffuser in your dog\'s safe space and replace refill monthly. The collar provides 24/7 coverage for 4 weeks. Spray can be applied to bedding or car crates 15 minutes before use. Multiple peer-reviewed studies show reduced signs of anxiety during fireworks, thunderstorms, separation, and vet visits. Most effective when combined with behavioral modification.',
      },
      {
        id: 'feliway',
        title: 'Feliway (Cats)',
        icon: <Shield size={20} />,
        evidence: 'Strong',
        summary: 'Synthetic feline facial pheromone (FFP) that replicates the "happy markers" cats leave when rubbing their face on objects.',
        detail: 'Feliway Classic reduces general stress (spraying, hiding, scratching). Feliway Friends (formerly Multicat) uses the cat-appeasing pheromone to reduce inter-cat tension. Use diffusers in rooms where the cat spends most time. Do not place near litter boxes or near open windows/air vents. Evidence supports efficacy for urine marking reduction and travel stress. Replace diffuser unit every 6 months, refills monthly.',
      },
    ],
  },
  {
    title: 'Calming Supplements',
    cards: [
      {
        id: 'ltheanine',
        title: 'L-Theanine (Anxitane)',
        icon: <Pill size={20} />,
        evidence: 'Moderate',
        summary: 'Amino acid from green tea that promotes relaxation without sedation by increasing GABA, serotonin, and dopamine.',
        detail: 'Dosing: Dogs typically 2mg/kg twice daily; cats 25-50mg twice daily. Takes 30-60 minutes to take effect. No known drug interactions or significant side effects. Available as Anxitane (veterinary brand) or over-the-counter supplements. Studies show reduced fear-based behaviors in noise phobia and storm anxiety. Best used as part of a multi-modal approach alongside behavioral modification. Always consult your vet for dosing.',
      },
      {
        id: 'zylkene',
        title: 'Zylkene (Alpha-Casozepine)',
        icon: <Pill size={20} />,
        evidence: 'Moderate',
        summary: 'Milk protein derivative that binds to GABA-A receptors, mimicking the calming effect of nursing in puppies and kittens.',
        detail: 'Derived from bovine casein via trypsin hydrolysis. Dosing: 15mg/kg once daily, can be given in food. Start 1-2 days before known stressor for best results, or use daily for chronic anxiety. No sedation, no known drug interactions. Safe for long-term use. Particularly effective for environmental changes (moving, new baby, boarding). Veterinary studies show significant reduction in anxiety scores compared to placebo.',
      },
      {
        id: 'melatonin',
        title: 'Melatonin',
        icon: <Pill size={20} />,
        evidence: 'Limited',
        summary: 'Natural hormone that regulates sleep-wake cycles. May reduce noise phobia and separation anxiety through mild sedation.',
        detail: 'Dosing: Dogs under 10kg: 1mg; 10-25kg: 1.5mg; 25-45kg: 3mg; over 45kg: 3-6mg. Give 30 minutes before anticipated stressor. IMPORTANT: Use only plain melatonin - avoid products with xylitol (toxic to dogs). Evidence is largely anecdotal but widely recommended by veterinary behaviorists as a low-risk option. May help with noise phobias when given preventatively. Can be combined with other supplements. Consult your veterinarian.',
      },
    ],
  },
  {
    title: 'When to See a Vet Behaviorist',
    cards: [
      {
        id: 'dacvb',
        title: 'DACVB Referral Checklist',
        icon: <Stethoscope size={20} />,
        evidence: 'Strong',
        summary: 'A Diplomate of the American College of Veterinary Behaviorists (DACVB) is a board-certified veterinary behavior specialist.',
        detail: 'Seek a DACVB referral if ANY of these apply:\n\n• Aggression toward people or other animals (biting, lunging, growling with intent)\n• Self-injurious behavior (excessive licking causing wounds, tail chasing to injury, flank sucking)\n• Anxiety lasting 8+ weeks with no improvement despite training\n• Pet cannot eat, drink, or function normally during anxiety episodes\n• Panic attacks causing property destruction or escape attempts\n• Owner safety is at risk\n• Multiple behavioral issues co-occurring\n• Previous behavioral medication has been ineffective\n\nA DACVB can prescribe medication (fluoxetine, trazodone, gabapentin, etc.) and create a comprehensive behavior modification plan. Find one at dacvb.org or ask your primary vet for a referral.',
      },
    ],
  },
  {
    title: 'Environmental Enrichment',
    proOnly: true,
    cards: [
      {
        id: 'lickmat',
        title: 'Lick Mats',
        icon: <Puzzle size={20} />,
        evidence: 'Moderate',
        summary: 'Repetitive licking stimulates endorphin release and activates the parasympathetic nervous system, producing a natural calming effect.',
        detail: 'Spread soft food (peanut butter without xylitol, pumpkin puree, wet food, plain yogurt) on a textured lick mat. Freeze for longer-lasting engagement. Use during storms, fireworks, vet visits, grooming, or any known stressor. The repetitive tongue motion is self-soothing. Studies show licking can lower heart rate in dogs. Start with easy-to-lick foods before graduating to frozen. Supervise first uses. Clean thoroughly after each use.',
      },
      {
        id: 'snufflemat',
        title: 'Snuffle Mats & Puzzle Feeders',
        icon: <Puzzle size={20} />,
        evidence: 'Moderate',
        summary: 'Nose work activates the parasympathetic nervous system. 15 minutes of sniffing provides mental fatigue equivalent to a 60-minute walk.',
        detail: 'Scatter kibble or treats in a snuffle mat, forcing the pet to use their nose to find food. This engages the seeking/foraging circuit (dopamine pathway) which is inherently rewarding and incompatible with anxiety. For puzzle feeders, start at the easiest difficulty and gradually increase. Rotate puzzles weekly to prevent boredom. DIY options: muffin tin with tennis balls on top, cardboard box with crumpled paper. Always supervise to prevent ingestion of mat material.',
      },
      {
        id: 'thundershirt',
        title: 'Pressure Wraps (ThunderShirt)',
        icon: <Shield size={20} />,
        evidence: 'Moderate',
        summary: 'Constant gentle pressure around the torso may activate the autonomic nervous system, similar to swaddling an infant.',
        detail: 'Apply snugly (two fingers should fit underneath) 15-30 minutes before anticipated anxiety trigger. Do NOT leave on for more than 2 hours continuously. Introduce gradually: short positive sessions with treats before associating with stressors. The pressure may increase oxytocin and decrease cortisol. Studies show mixed but generally positive results for noise phobia and mild anxiety. Most effective when combined with other interventions. Available in multiple sizes for dogs and cats.',
      },
      {
        id: 'safespace',
        title: 'Safe Space Setup',
        icon: <Shield size={20} />,
        evidence: 'Strong',
        summary: 'Every anxious pet needs a designated retreat area where they feel completely secure and are never disturbed.',
        detail: 'Choose a quiet, interior room or corner away from windows and external walls. Provide:\n\n• Covered crate or den (drape a blanket over, leaving one side open)\n• Comfortable bedding with the pet\'s scent\n• Adaptil/Feliway diffuser nearby\n• Access to water\n• White noise machine or calming music\n• Dim lighting\n\nRules: Never force the pet out of their safe space. Never use the safe space for punishment. Let the pet choose when to enter and leave. Practice going to the safe space during calm times with treats so it builds a positive association BEFORE a crisis.',
      },
    ],
  },
  {
    title: 'Senior Pet Anxiety (CDS)',
    proOnly: true,
    cards: [
      {
        id: 'dishaa',
        title: 'DISHAA Checklist',
        icon: <Brain size={20} />,
        evidence: 'Strong',
        summary: 'Cognitive Dysfunction Syndrome (CDS) affects 28% of dogs aged 11-12 and 68% of dogs aged 15-16. The DISHAA checklist helps identify it early.',
        detail: 'Monitor your senior pet (8+ years) for these signs:\n\n• D - Disorientation: Getting stuck in corners, staring at walls, not recognizing familiar people\n• I - Interactions: Decreased interest in petting, irritability, not greeting family members\n• S - Sleep-wake changes: Pacing at night, sleeping more during the day, restlessness\n• H - Housetraining: Accidents indoors from a previously housetrained pet\n• A - Activity: Repetitive behaviors (circling, licking), decreased play, aimless wandering\n• A - Anxiety: New-onset separation anxiety, noise sensitivity, general fearfulness\n\nIf 2+ categories are affected, see your vet. CDS is NOT normal aging. Treatments include: selegiline (Anipryl), SAMe supplements, omega-3 fatty acids, environmental enrichment, diet change (Hill\'s b/d or Purina Neurocare), and maintaining consistent routines. Early intervention slows progression significantly.',
      },
    ],
  },
];

const evidenceBadgeColor = (level: string) => {
  switch (level) {
    case 'Strong': return 'bg-status-success/10 text-status-success';
    case 'Moderate': return 'bg-status-warning/10 text-status-warning';
    case 'Limited': return 'bg-neutral-200 text-neutral-subtext';
    default: return 'bg-neutral-200 text-neutral-subtext';
  }
};

export const Guide: React.FC = () => {
  const { isPro, openPaywall } = usePro();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string, proOnly?: boolean) => {
    if (proOnly && !isPro) {
      openPaywall();
      return;
    }
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="pb-24 pt-6 px-6">
      <h1 className="text-2xl font-bold text-neutral-text mb-2">Wellness Guide</h1>
      <p className="text-sm text-neutral-subtext mb-6">Evidence-based therapies, supplements, and enrichment strategies. Always consult your veterinarian.</p>

      {GUIDE_SECTIONS.map((section) => {
        const sectionLocked = section.proOnly && !isPro;
        return (
          <div key={section.title} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-xs font-bold text-neutral-subtext uppercase tracking-wider">{section.title}</h2>
              {sectionLocked && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Crown size={9} /> PRO
                </span>
              )}
            </div>
            <div className="space-y-3">
              {section.cards.map((card) => {
                const isOpen = expanded[card.id] || false;
                return (
                  <div key={card.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggle(card.id, section.proOnly)}
                      className="w-full p-4 flex items-start gap-3 text-left"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${sectionLocked ? 'bg-amber-50 text-amber-500' : 'bg-primary/10 text-primary'}`}>
                        {sectionLocked ? <Crown size={20} /> : card.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-neutral-text text-sm">{card.title}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${evidenceBadgeColor(card.evidence)}`}>
                            {card.evidence}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-subtext leading-relaxed">{card.summary}</p>
                        {sectionLocked && (
                          <p className="text-[11px] text-amber-600 font-medium mt-1">Tap to unlock clinical detail — Pro feature</p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-neutral-400 mt-1">
                        {sectionLocked ? <Crown size={16} className="text-amber-400" /> : isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>
                    {isOpen && !sectionLocked && (
                      <div className="px-4 pb-4 pt-0 ml-[52px] border-t border-neutral-50">
                        <p className="text-xs text-neutral-text leading-relaxed whitespace-pre-line pt-3">{card.detail}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
