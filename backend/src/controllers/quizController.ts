import { Request, Response } from 'express';
import { Product } from '../models/Product';

interface QuizAnswerPayload {
  season?: 'summer' | 'winter' | 'spring' | 'autumn' | 'any';
  occasion?: 'evening' | 'daylight' | 'ceremony' | 'gifting' | 'intimate';
  mood?: 'mysterious' | 'luminous' | 'grounded' | 'regal' | 'fresh';
  preferredNotes?: string[];
  intensity?: 'light' | 'moderate' | 'intense' | 'ultra-extrait';
}

export const recommendFragrance = async (req: Request, res: Response) => {
  try {
    const { season, occasion, mood, preferredNotes = [], intensity }: QuizAnswerPayload = req.body;

    const allProducts = await Product.find({});
    if (allProducts.length === 0) {
      return res.status(404).json({ success: false, message: 'No fragrances available' });
    }

    // Scoring algorithm based on olfactory archetypes and notes
    const scored = allProducts.map((prod) => {
      let score = 50; // base score

      const desc = `${prod.name} ${prod.subtitle} ${prod.description} ${prod.category} ${prod.archetype}`.toLowerCase();
      const notesStr = [
        typeof prod.notes?.top === 'string' ? prod.notes.top : (prod.notes?.top || []).join(' '),
        typeof prod.notes?.heart === 'string' ? prod.notes.heart : (prod.notes?.heart || []).join(' '),
        typeof prod.notes?.base === 'string' ? prod.notes.base : (prod.notes?.base || []).join(' ')
      ].join(' ').toLowerCase();

      // Season matching
      if (season === 'summer' && (desc.includes('citrus') || desc.includes('solar') || desc.includes('fresh'))) score += 15;
      if (season === 'winter' && (desc.includes('amber') || desc.includes('vanilla') || desc.includes('incense') || desc.includes('oud'))) score += 15;
      if (season === 'spring' && (desc.includes('floral') || desc.includes('rose') || desc.includes('jasmine'))) score += 15;
      if (season === 'autumn' && (desc.includes('wood') || desc.includes('leather') || desc.includes('sandalwood'))) score += 15;

      // Occasion matching
      if (occasion === 'evening' && (desc.includes('nocturne') || desc.includes('velvet') || desc.includes('amber') || desc.includes('oud'))) score += 15;
      if (occasion === 'daylight' && (desc.includes('citrus') || desc.includes('bergamot') || desc.includes('vert'))) score += 15;
      if (occasion === 'ceremony' && (desc.includes('solstice') || desc.includes('santal') || desc.includes('sacred'))) score += 15;

      // Mood matching
      if (mood === 'mysterious' && (desc.includes('smoke') || desc.includes('incense') || desc.includes('fumé') || desc.includes('oud'))) score += 12;
      if (mood === 'luminous' && (desc.includes('solstice') || desc.includes('solar') || desc.includes('neroli'))) score += 12;
      if (mood === 'grounded' && (desc.includes('sandalwood') || desc.includes('cedar') || desc.includes('orris'))) score += 12;
      if (mood === 'regal' && (desc.includes('impériale') || desc.includes('royal') || desc.includes('parchment'))) score += 12;

      // User preferred notes match
      if (preferredNotes.length > 0) {
        preferredNotes.forEach((note) => {
          if (notesStr.includes(note.toLowerCase()) || desc.includes(note.toLowerCase())) {
            score += 18;
          }
        });
      }

      // Intensity match
      if (intensity === 'ultra-extrait' && prod.concentration?.includes('35%')) score += 10;
      if (intensity === 'intense' && prod.concentration?.includes('Extrait')) score += 8;

      const matchPercentage = Math.min(99, Math.max(78, Math.round(score)));

      return {
        product: prod,
        matchPercentage,
        score
      };
    });

    scored.sort((a, b) => b.score - a.score);

    const primary = scored[0];
    const companions = scored.slice(1, 3);

    let narrativeExplanation = `Based on your inclination towards ${mood || 'refined'} sensory moments and preferred botanical nuances, this signature flacon harmonizes effortlessly with your body chemistry.`;
    if (primary.product.name.includes('Santal')) {
      narrativeExplanation = 'Your desire for grounding warmth and timeless sophistication leads directly to Santal Parchment. Its creamy Mysore sandalwood and Florentine orris form a noble, contemplative veil.';
    } else if (primary.product.name.includes('Velvet') || primary.product.name.includes('Ambre')) {
      narrativeExplanation = 'For nocturnal encounters and magnetic allure, Velvet Noir Fumé offers an intoxicating blend of Somalian incense and rich bourbon vanilla.';
    } else if (primary.product.name.includes('Solstice') || primary.product.name.includes('Citrus')) {
      narrativeExplanation = 'Your affinity for luminous, invigorating daylight harmonizes with the solar neroli, crushed basil, and sparkling Italian bergamot in this composition.';
    }

    res.json({
      success: true,
      recommendation: {
        primaryProduct: primary.product,
        matchPercentage: primary.matchPercentage,
        narrativeExplanation,
        companionProducts: companions.map((c) => ({
          product: c.product,
          matchPercentage: c.matchPercentage
        }))
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
