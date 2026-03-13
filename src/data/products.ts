import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

export interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  colors: string[];
  dimensions: string[];
  category: string;
  featured: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    title: "Classic White Cotton Nappe",
    description: "A timeless white cotton tablecloth, perfect for everyday dining. Soft, durable, and easy to care for.",
    images: [product1, product2, product3],
    colors: ["White", "Beige", "Gray"],
    dimensions: ["140 x 180 cm", "140 x 220 cm", "140 x 260 cm"],
    category: "everyday",
    featured: true,
  },
  {
    id: "2",
    title: "Elegant Beige Linen Nappe",
    description: "A sophisticated beige linen tablecloth that brings warmth and elegance to any table setting.",
    images: [product2, product1, product4],
    colors: ["Beige", "White", "Blue"],
    dimensions: ["140 x 180 cm", "140 x 220 cm", "140 x 260 cm"],
    category: "everyday",
    featured: true,
  },
  {
    id: "3",
    title: "Royal Blue Dining Nappe",
    description: "A bold and stunning blue tablecloth for those who love to make a statement at the dinner table.",
    images: [product3, product4, product1],
    colors: ["Blue", "White", "Gray"],
    dimensions: ["140 x 180 cm", "140 x 220 cm", "140 x 260 cm"],
    category: "premium",
    featured: true,
  },
  {
    id: "4",
    title: "Modern Gray Satin Nappe",
    description: "A sleek gray satin tablecloth with a subtle sheen, ideal for modern dining rooms and restaurants.",
    images: [product4, product3, product2],
    colors: ["Gray", "White", "Beige"],
    dimensions: ["140 x 180 cm", "140 x 220 cm", "140 x 260 cm"],
    category: "premium",
    featured: true,
  },
  {
    id: "5",
    title: "Grand Damask Event Nappe",
    description: "An exquisite damask tablecloth with intricate embroidered patterns, perfect for weddings and galas.",
    images: [product5, product6, product2],
    colors: ["White", "Beige", "Blue"],
    dimensions: ["140 x 180 cm", "140 x 220 cm", "140 x 260 cm"],
    category: "event",
    featured: true,
  },
  {
    id: "6",
    title: "Garden Party Nappe",
    description: "A beautiful cream tablecloth designed for outdoor events, garden parties, and special celebrations.",
    images: [product6, product5, product1],
    colors: ["Beige", "White", "Gray"],
    dimensions: ["140 x 180 cm", "140 x 220 cm", "140 x 260 cm"],
    category: "event",
    featured: true,
  },
];

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: "everyday",
    name: "Everyday Nappes",
    description: "Comfortable and durable tablecloths for daily use at home.",
    image: product1,
  },
  {
    id: "premium",
    name: "Premium Nappes",
    description: "Luxurious fabrics and refined designs for an elevated dining experience.",
    image: product4,
  },
  {
    id: "event",
    name: "Event Nappes",
    description: "Elegant tablecloths for weddings, galas, and special celebrations.",
    image: product5,
  },
];
