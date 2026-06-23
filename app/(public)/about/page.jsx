import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { stats, whyChooseUs } from "@/lib/utils";

export const metadata = {
  title: "About Us",
  description:
    "Learn about AK Enterprises - crafting a legacy of luxury and trust in Ambernath's premium real estate landscape for over a decade.",
};

export default function AboutPage() {
  return (
    <>
      <section className="relative h-[409px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/About.jpg"
            alt="About AK Enterprises"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/40 to-surface" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto text-center px-6">
          <nav className="flex justify-center items-center gap-2 mb-6 text-xs font-semibold uppercase tracking-widest text-primary">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Icon name="chevron_right" size={12} className="text-primary" />
            <span className="text-white/60">About Us</span>
          </nav>
          <h1
            className="font-headline text-white mb-4"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              lineHeight: 1.1,
              fontWeight: 600,
              textShadow: "2px 4px 16px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.4)"
            }}
          >
            About AK Enterprises
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Crafting a legacy of luxury and trust in Ambernath&apos;s premium real
            estate landscape for over a decade.
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-4/3 rounded-xl overflow-hidden group">
            <Image
              src="/SideImage.jpg"
              alt="AK Enterprises office building at twilight"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 border-2 border-primary/20 rounded-xl pointer-events-none" />
          </div>
          <div className="space-y-8">
            <div>
              <span className="text-primary-fixed-dim text-xs font-semibold uppercase tracking-[0.2em] block mb-4">
                Who We Are
              </span>
              <h2
                className="font-headline text-white mb-6"
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  lineHeight: 1.3,
                  fontWeight: 600,
                }}
              >
                Built on Trust, Defined by Excellence.
              </h2>
              <p className="text-on-surface-variant leading-relaxed mb-6">
                Since our inception, AK Enterprises has been at the forefront of
                redefining luxury living in Ambernath. We don&apos;t just sell
                properties; we curate lifestyles. Our deep-rooted local expertise
                allows us to identify unique opportunities that others miss,
                ensuring our clients invest in nothing but the best.
              </p>
              <p className="text-on-surface-variant leading-relaxed">
                Our philosophy is simple: uncompromising quality and absolute
                transparency. Whether it&apos;s a sprawling residential estate or a
                strategic commercial hub, we bring the same level of dedication
                and premium service to every transaction.
              </p>
            </div>
            <div>
              <Button variant="ghost" icon="arrow_right_alt" iconPosition="right">
                Learn more about our heritage
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-surface-container-low">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-8 border-r border-primary/10 last:border-0"
            >
              <div
                className="text-primary mb-2"
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                {stat.value}
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2
              className="font-headline text-on-surface mb-6"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 600,
              }}
            >
              Our Core Values
            </h2>
            <p className="text-on-surface-variant">
              Every interaction is guided by principles that have built our
               reputation as Ambernath&apos;s most trusted property partner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item) => (
              <div
                key={item.title}
                className="p-8 border border-outline/10 rounded-2xl hover:border-primary/40 transition-colors"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Icon name={item.icon} size={28} className="text-primary" />
                </div>
                <h4 className="font-bold text-xl mb-3 text-on-surface">
                  {item.title}
                </h4>
                <p className="text-on-surface-variant text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-surface-container-lowest">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="font-headline text-on-surface mb-6"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 600,
            }}
          >
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-on-surface-variant text-lg mb-10 max-w-2xl mx-auto">
            Let our experts guide you to the perfect investment in Ambernath&apos;s
            most prestigious addresses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties">
              <Button variant="primary" size="lg">
                Browse Properties
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outlined" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
