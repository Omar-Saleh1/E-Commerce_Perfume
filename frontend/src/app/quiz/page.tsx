'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ApiClient, IQuizRecommendation } from '@/patterns/api/AbstractApiClientFactory';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import { Sparkles, ArrowRight, ArrowLeft, RefreshCw, ShoppingBag, Check, Droplets, Heart } from 'lucide-react';

export default function QuizPage() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    season: 'winter',
    mood: 'mysterious',
    occasion: 'evening',
    intensity: 'intense',
    preferredNotes: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<IQuizRecommendation | null>(null);
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleNoteToggle = (note: string) => {
    setAnswers(prev => ({
      ...prev,
      preferredNotes: prev.preferredNotes.includes(note)
        ? prev.preferredNotes.filter(n => n !== note)
        : [...prev.preferredNotes, note]
    }));
  };

  const handleFinishQuiz = async () => {
    setLoading(true);
    try {
      const res = await ApiClient.getQuizRecommendation(answers);
      if (res) {
        setRecommendation(res);
      } else {
        // Fallback default recommendation
        setRecommendation({
          primaryProduct: {
            _id: 'prod-santal',
            name: 'Santal Parchment',
            subtitle: 'Australian Sandalwood • Tuscan Leather • French Orris',
            slug: 'santal-parchment',
            description: 'An evocative olfactory homage to ancient manuscript ateliers. Opening with dry cardamom and sparkling Italian bergamot.',
            price: 280,
            oldPrice: 320,
            category: 'Woody & Earthy',
            archetype: 'Woody',
            concentration: 'Extrait de Parfum (30% Conc.)',
            volume: '50ml / 1.7 fl.oz',
            brand: 'Odoratus',
            stock: 18,
            rating: 4.9,
            reviewsCount: 54,
            image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80',
            images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80'],
            isFeatured: true
          },
          matchPercentage: 97,
          narrativeExplanation: 'Your desire for grounding warmth and timeless sophistication leads directly to Santal Parchment. Its creamy Mysore sandalwood and Florentine orris form a noble, contemplative veil.',
          companionProducts: []
        });
      }
    } catch {
      showToast('Completed consultation with luxury match');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f6f0] dark:bg-[#0d0c0b] text-[#1a1816] dark:text-[#f8f6f0] py-12 min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#7a746e] dark:text-[#a6a096] mb-8">
          <Link href="/" className="hover:text-[#b38b4d] flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Maison Home
          </Link>
          <span>/</span>
          <span className="text-[#8c6d3b] dark:text-[#c29b62] font-semibold">AI Olfactory Consultation</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#8c6d3b] dark:text-[#c29b62] font-semibold mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Algorithmic Atelier</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1a1816] dark:text-[#f8f6f0] mb-3">
            Find Your Signature Scent
          </h1>
          <p className="text-xs sm:text-sm text-[#7a746e] dark:text-[#a6a096] font-sans">
            Answer 4 questions to synthesize your custom olfactory profile matched with our artisanal extrait formulas.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-16 text-center shadow-lg space-y-4">
            <div className="w-12 h-12 border-2 border-[#b38b4d] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h3 className="font-serif text-2xl text-[#1a1816] dark:text-white">Synthesizing Olfactory Formula...</h3>
            <p className="text-xs text-[#7a746e] dark:text-[#a6a096]">
              Matching raw botanicals, molecular weight, and seasonal evaporation rates with Grasse distillation archives.
            </p>
          </div>
        )}

        {/* Result Reveal Card */}
        {!loading && recommendation && (
          <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 sm:p-10 shadow-2xl space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between border-b border-[#e8e2d4] dark:border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#8c6d3b] dark:text-[#c29b62] font-semibold">
                  Your Bespoke Recommendation
                </span>
              </div>
              <span className="bg-[#b38b4d] text-white text-xs font-serif font-bold px-3 py-1">
                {recommendation.matchPercentage}% Olfactory Match
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 aspect-square bg-[#f3efe6] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 p-8 flex items-center justify-center">
                <img
                  src={recommendation.primaryProduct.image}
                  alt={recommendation.primaryProduct.name}
                  className="max-h-full max-w-full object-contain drop-shadow-xl"
                />
              </div>

              <div className="md:col-span-7 space-y-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8c6d3b] dark:text-[#c29b62] font-semibold">
                  {recommendation.primaryProduct.concentration || 'Extrait de Parfum'} &middot; {recommendation.primaryProduct.volume || '50ml'}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#1a1816] dark:text-white font-normal">
                  {recommendation.primaryProduct.name}
                </h2>
                <p className="font-serif italic text-sm text-[#8c6d3b] dark:text-[#c29b62]">
                  {recommendation.primaryProduct.subtitle}
                </p>

                <div className="p-4 bg-[#f8f6f0] dark:bg-[#1a1816] border border-[#e8e2d4] dark:border-white/10 text-xs text-[#7a746e] dark:text-[#a6a096] leading-relaxed">
                  {recommendation.narrativeExplanation}
                </div>

                <div className="flex items-baseline justify-between pt-2">
                  <span className="font-serif text-2xl font-bold text-[#1a1816] dark:text-white">
                    {formatPrice(recommendation.primaryProduct.price)}
                  </span>
                  <span className="text-[10px] text-[#7a746e] uppercase">Includes 2 discovery samples</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => {
                      addItem(recommendation.primaryProduct, 1);
                      showToast(`Added ${recommendation.primaryProduct.name} to your Shopping Bag 🛍️`);
                    }}
                    className="flex-1 py-3.5 bg-[#1a1816] hover:bg-[#b38b4d] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:hover:bg-[#c29b62] dark:text-[#1a1816] text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Flacon to Bag</span>
                  </button>

                  <Link href={`/products/${recommendation.primaryProduct._id || recommendation.primaryProduct.id}`} className="flex-1">
                    <button className="w-full py-3.5 border border-[#1a1816] dark:border-white/20 text-[#1a1816] dark:text-[#f8f6f0] text-xs uppercase tracking-widest font-semibold hover:bg-[#1a1816] hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                      View Olfactory Notes
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#e8e2d4] dark:border-white/10 text-center">
              <button
                onClick={() => {
                  setRecommendation(null);
                  setStep(1);
                }}
                className="text-xs uppercase tracking-wider text-[#8c6d3b] dark:text-[#c29b62] hover:text-[#1a1816] dark:hover:text-white flex items-center justify-center gap-1.5 mx-auto font-semibold"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retake Consultation Quiz</span>
              </button>
            </div>
          </div>
        )}

        {/* 4-Step Quiz Flow */}
        {!loading && !recommendation && (
          <div className="bg-white dark:bg-[#141211] border border-[#e8e2d4] dark:border-white/10 p-6 sm:p-10 shadow-sm space-y-8">
            
            {/* Progress Stepper */}
            <div className="flex items-center justify-between border-b border-[#e8e2d4] dark:border-white/10 pb-4 text-xs font-semibold">
              <span className="text-[#8c6d3b] dark:text-[#c29b62] uppercase tracking-wider">
                Step {step} of 4
              </span>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(s => (
                  <div
                    key={s}
                    className={`h-1.5 w-8 transition-colors ${
                      step >= s ? 'bg-[#b38b4d]' : 'bg-[#e8e2d4] dark:bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step 1: Desired Mood */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#1a1816] dark:text-white mb-2">
                    What mood or aura do you wish to project?
                  </h3>
                  <p className="text-xs text-[#7a746e] dark:text-[#a6a096]">
                    Select the emotional resonance you seek from your signature scent.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'mysterious', title: 'Mysterious & Nocturnal', desc: 'Smoky frankincense, dark vanilla, velvety woods' },
                    { id: 'luminous', title: 'Luminous & Solar', desc: 'Sun-drenched citrus, neroli blossoms, golden aldehydes' },
                    { id: 'grounded', title: 'Grounded & Contemplative', desc: 'Mysore sandalwood, papery leather, Florentine orris' },
                    { id: 'regal', title: 'Regal & Majestic', desc: 'Aged vintage agarwood, Taif rose, crimson saffron' },
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setAnswers({ ...answers, mood: m.id as any })}
                      className={`p-5 text-left border transition-all ${
                        answers.mood === m.id
                          ? 'border-[#1a1816] bg-[#f8f6f0] dark:border-[#c29b62] dark:bg-[#1a1816] shadow-sm'
                          : 'border-[#e8e2d4] dark:border-white/10 hover:border-[#b38b4d]'
                      }`}
                    >
                      <h4 className="font-serif text-lg font-medium text-[#1a1816] dark:text-white mb-1">{m.title}</h4>
                      <p className="text-xs text-[#7a746e] dark:text-[#a6a096]">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Season & Atmosphere */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#1a1816] dark:text-white mb-2">
                    Which season or atmosphere inspires you?
                  </h3>
                  <p className="text-xs text-[#7a746e] dark:text-[#a6a096]">
                    Fragrance molecules interact dynamically with ambient temperature and humidity.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'winter', title: 'Winter & Crisp Autumn', desc: 'Resinous ambers, sacred woods, enveloping sillage' },
                    { id: 'summer', title: 'Summer Solstice', desc: 'Crisp bergamot, sea minerals, crushed garden basil' },
                    { id: 'spring', title: 'Spring Bloom in Grasse', desc: 'Centifolia dawn roses, white jasmine, dewy petals' },
                    { id: 'any', title: 'All-Season Signature', desc: 'Versatile noble woods, clean cardamoms, delicate musks' },
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setAnswers({ ...answers, season: s.id as any })}
                      className={`p-5 text-left border transition-all ${
                        answers.season === s.id
                          ? 'border-[#1a1816] bg-[#f8f6f0] dark:border-[#c29b62] dark:bg-[#1a1816] shadow-sm'
                          : 'border-[#e8e2d4] dark:border-white/10 hover:border-[#b38b4d]'
                      }`}
                    >
                      <h4 className="font-serif text-lg font-medium text-[#1a1816] dark:text-white mb-1">{s.title}</h4>
                      <p className="text-xs text-[#7a746e] dark:text-[#a6a096]">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Preferred Notes Selection */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#1a1816] dark:text-white mb-2">
                    Select your favored botanical accords
                  </h3>
                  <p className="text-xs text-[#7a746e] dark:text-[#a6a096]">
                    Pick 1 to 4 raw materials you are naturally drawn to.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {[
                    'Sandalwood', 'Cardamom', 'Vanilla', 'Amber', 'Incense',
                    'Bergamot', 'Orris Root', 'May Rose', 'Oud', 'Neroli',
                    'Basil', 'Leather', 'Jasmine', 'Sea Salt'
                  ].map(note => {
                    const isSel = answers.preferredNotes.includes(note);
                    return (
                      <button
                        key={note}
                        onClick={() => handleNoteToggle(note)}
                        className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold border transition-all flex items-center gap-1.5 ${
                          isSel
                            ? 'bg-[#1a1816] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:text-[#1a1816] border-transparent'
                            : 'bg-[#f8f6f0] dark:bg-[#1a1816] text-[#7a746e] dark:text-[#a6a096] border-[#e8e2d4] dark:border-white/10 hover:border-[#b38b4d]'
                        }`}
                      >
                        {isSel && <Check className="w-3.5 h-3.5" />}
                        <span>{note}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Concentration & Sillage Intensity */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#1a1816] dark:text-white mb-2">
                    What concentration and longevity do you prefer?
                  </h3>
                  <p className="text-xs text-[#7a746e] dark:text-[#a6a096]">
                    All Odoratus perfumes are formulated with pure, undiluted botanical absolutes.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'ultra-extrait', title: 'Ultra-Pure Extrait (32% - 35%)', desc: 'Extreme longevity (16+ hours), rich heavy sillage' },
                    { id: 'intense', title: 'Classic Extrait (28% - 30%)', desc: 'The golden standard of French haute parfumerie' },
                    { id: 'moderate', title: 'Eau de Parfum Intense (22%)', desc: 'Invigorating daytime sillage with sparkling top notes' },
                  ].map(i => (
                    <button
                      key={i.id}
                      onClick={() => setAnswers({ ...answers, intensity: i.id as any })}
                      className={`p-5 text-left border transition-all ${
                        answers.intensity === i.id
                          ? 'border-[#1a1816] bg-[#f8f6f0] dark:border-[#c29b62] dark:bg-[#1a1816] shadow-sm'
                          : 'border-[#e8e2d4] dark:border-white/10 hover:border-[#b38b4d]'
                      }`}
                    >
                      <h4 className="font-serif text-lg font-medium text-[#1a1816] dark:text-white mb-1">{i.title}</h4>
                      <p className="text-xs text-[#7a746e] dark:text-[#a6a096]">{i.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-[#e8e2d4] dark:border-white/10">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-5 py-2.5 border border-[#e8e2d4] dark:border-white/10 text-xs uppercase tracking-wider font-semibold hover:border-[#b38b4d] transition-colors"
                >
                  Back
                </button>
              ) : <div></div>}

              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-8 py-3 bg-[#1a1816] hover:bg-[#b38b4d] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:hover:bg-[#c29b62] dark:text-[#1a1816] text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleFinishQuiz}
                  className="px-8 py-3.5 bg-[#1a1816] hover:bg-[#b38b4d] text-[#f8f6f0] dark:bg-[#f8f6f0] dark:hover:bg-[#c29b62] dark:text-[#1a1816] text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#b38b4d]" />
                  <span>Reveal My Signature Scent</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
