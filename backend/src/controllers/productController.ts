import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { RepositoryFactory } from '../patterns/database/AbstractRepositoryFactory';

const productRepo = RepositoryFactory.createProductRepository();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, sort, page = '1', limit = '24', minPrice, maxPrice } = req.query;
    const query: any = {};

    if (category && category !== 'all') {
      query.category = { $regex: new RegExp(String(category), 'i') };
    }
    if (search) {
      query.$or = [
        { name: { $regex: String(search), $options: 'i' } },
        { description: { $regex: String(search), $options: 'i' } },
        { brand: { $regex: String(search), $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'rating-desc') sortOption = { rating: -1 };
    if (sort === 'name-asc') sortOption = { name: 1 };

    const pageNum = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      productRepo.find(query, sortOption, limitNum, skip),
      productRepo.count(query)
    ]);

    res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      products
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const products = await productRepo.find({ isFeatured: true }, { rating: -1 }, 8);
    res.json({ success: true, products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productRepo.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProductReview = async (req: any, res: Response) => {
  try {
    const { rating, comment, name } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const review = {
      user: req.user?._id,
      name: name || req.user?.name || 'Verified Customer',
      rating: Number(rating),
      comment
    };

    product.reviews.unshift(review);
    product.reviewsCount = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ success: true, message: 'Review added successfully', product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
