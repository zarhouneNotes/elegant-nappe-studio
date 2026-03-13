export default function Policies() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl space-y-12">
        <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">Policies</h1>

        <section id="shipping">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Shipping Policy</h2>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>We ship to all locations within our service area. Orders are typically processed within 1–3 business days.</p>
            <p>Standard shipping takes 5–7 business days. Express shipping options are available at checkout.</p>
            <p>Shipping costs are calculated based on your location and order size. Free shipping is available for orders above a minimum threshold.</p>
          </div>
        </section>

        <section id="returns">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Return Policy</h2>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>We accept returns within 14 days of delivery for unused and undamaged products in their original packaging.</p>
            <p>To initiate a return, please contact our support team with your order details. Return shipping costs are the responsibility of the customer unless the item is defective.</p>
            <p>Refunds will be processed within 5–10 business days after we receive the returned item.</p>
          </div>
        </section>

        <section id="privacy">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Privacy Policy</h2>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>We respect your privacy and are committed to protecting your personal information. We collect only the data necessary to process your orders and improve your experience.</p>
            <p>Your information is never sold or shared with third parties for marketing purposes. We use industry-standard security measures to protect your data.</p>
            <p>By using our website, you consent to the collection and use of your information as described in this policy.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
