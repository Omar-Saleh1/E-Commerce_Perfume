import { Request, Response } from 'express';
import { User } from '../models/User';
import { Coupon } from '../models/Coupon';

export const getLoyaltyProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Determine tier based on points
    let vipTier: 'Bronze' | 'Silver' | 'Gold' | 'Atelier Connoisseur' = 'Bronze';
    if (user.loyaltyPoints >= 1500) vipTier = 'Atelier Connoisseur';
    else if (user.loyaltyPoints >= 800) vipTier = 'Gold';
    else if (user.loyaltyPoints >= 400) vipTier = 'Silver';

    user.vipTier = vipTier;
    await user.save();

    res.json({
      success: true,
      loyalty: {
        points: user.loyaltyPoints,
        tier: user.vipTier,
        referralCode: user.referralCode,
        perks: [
          'Earn 10 Atelier Points for every $1 spent',
          'Complimentary engraved wooden gift flacon on reaching Silver tier',
          'Private 48-hour early access to limited solstice distillation releases',
          'Complimentary concierge fragrance consultation'
        ],
        redeemableRewards: [
          { pointsNeeded: 200, discount: '$25 Off Your Next Flacon', code: 'REWARD25' },
          { pointsNeeded: 400, discount: '$60 Off + Complimentary 10ml Travel Spray', code: 'REWARD60' },
          { pointsNeeded: 800, discount: 'Complimentary Discovery Flight (5x10ml)', code: 'REWARDVIP' }
        ]
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const redeemLoyaltyPoints = async (req: any, res: Response) => {
  try {
    const { pointsNeeded, discountAmount } = req.body;
    const user = await User.findById(req.user?._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.loyaltyPoints < pointsNeeded) {
      return res.status(400).json({ success: false, message: 'Insufficient loyalty points' });
    }

    user.loyaltyPoints -= Number(pointsNeeded);
    await user.save();

    const uniqueCode = `VIP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const newCoupon = new Coupon({
      code: uniqueCode,
      discountType: 'fixed',
      discountAmount: Number(discountAmount || 25),
      minOrderAmount: 100,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    await newCoupon.save();

    res.json({
      success: true,
      message: `Redeemed ${pointsNeeded} points successfully!`,
      couponCode: uniqueCode,
      remainingPoints: user.loyaltyPoints
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
