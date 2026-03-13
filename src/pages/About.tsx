import categoryPremium from "@/assets/category-premium.jpg";

export default function About() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">About Maison Nappe</h1>

        <div className="mt-8 overflow-hidden rounded-lg">
          <img src={categoryPremium} alt="Elegant dining setting" className="w-full object-cover" loading="lazy" />
        </div>

        <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Maison Nappe was founded with a simple mission: to bring elegance and quality to every dining table.
            We believe that a beautifully dressed table transforms any meal into a memorable occasion.
          </p>
          <p>
            Our collection features carefully selected fabrics — from soft everyday cotton to luxurious linen and
            satin — each chosen for its durability, feel, and timeless aesthetic. Every nappe is crafted with
            attention to detail, ensuring clean finishes and lasting beauty.
          </p>
          <p>
            Whether you are setting a casual family dinner, preparing a restaurant dining room, or decorating
            for a special event, Maison Nappe offers the perfect tablecloth to complement your vision.
          </p>
          <p>
            We are committed to quality, elegance, and customer satisfaction. Our team is dedicated to helping
            you find the ideal nappe for every occasion.
          </p>
        </div>
      </div>
    </div>
  );
}
