import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ContactForm } from "@/components/sections/ContactForm";
import { contactInfo } from "@/lib/utils";
import dbConnect from "@/lib/db/connect";
import SocialMedia from "@/lib/db/models/SocialMedia";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with AK Enterprises. Experience the pinnacle of luxury real estate service.",
};

export default async function ContactPage() {
  let socialLinks = [];
  try {
    await dbConnect();
    socialLinks = await SocialMedia.find({ isActive: true }).sort({ platform: 1 }).lean();
  } catch (error) {
    console.error("Failed to fetch social media links for contact page:", error);
  }

  // Fallback links if none exist in the database yet
  if (!socialLinks || socialLinks.length === 0) {
    socialLinks = [
      { platform: "Facebook", url: "https://facebook.com" },
      { platform: "Instagram", url: "https://instagram.com" },
      { platform: "WhatsApp", url: "https://wa.me/919876543210" },
    ];
  }
  return (
    <>
      <section className="relative h-[409px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe1d7GaB8kJaCtDFOiiEgTWnftU3Q76Fpktwp4iC7r5Urm_GTuBajueEczlnzCmxtsKt7ffYNeMKHh99D6AETyFhagjQj4ttXReA37XrdVN3DS2j-nhtNon8mZWWv1dkUjGsM0T6nHmNtmn38Z4Uyny4LeTbM3EbaWQ6GT5QPP_22uipwRhXRvl9jZOcwwvAlOZtnovs87mnX6mfqzdMJVnhUHVRbLmkd-uQ7m-2nPZwCHpKqEHrBeIM9CRE3OQ39zuy8BgUZGUIn8"
            alt="Luxury skyscraper at twilight"
            fill
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-t from-surface via-transparent to-transparent" />
        </div>
        <div className="relative z-10 text-center px-6">
          <h1
            className="font-headline text-primary mb-4"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              lineHeight: 1.2,
              fontWeight: 600,
            }}
          >
            Get In Touch
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
            Experience the pinnacle of luxury real estate service. Our experts
            are ready to guide you to your next masterpiece.
          </p>
        </div>
      </section>

      <main className="max-w-[1440px] mx-auto px-6 py-section-gap-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <ContactForm />

          <div className="lg:pl-12 space-y-12">
            <div>
              <h2
                className="font-headline text-on-surface mb-8"
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "1.75rem",
                  fontWeight: 600,
                }}
              >
                Contact Information
              </h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Icon name="location_on" size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-on-surface font-semibold mb-1">Address</p>
                    <p className="text-on-surface-variant">{contactInfo.address}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Icon name="phone" size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-on-surface font-semibold mb-1">Phone</p>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-primary hover:underline"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Icon name="mail" size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-on-surface font-semibold mb-1">Email</p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-primary hover:underline"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Icon name="schedule" size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-on-surface font-semibold mb-1">
                      Office Hours
                    </p>
                    <p className="text-on-surface-variant">{contactInfo.hours}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-on-surface font-semibold mb-6">
                Follow Us On Social Media
              </h3>
              <div className="flex gap-4">
                {socialLinks.map((item) => (
                  <a
                    key={String(item._id || item.platform)}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-on-surface hover:text-primary hover:bg-surface-container-high transition-colors"
                    title={item.platform}
                  >
                    <Icon name={item.platform} size={20} />
                  </a>
                ))}
              </div>
            </div>


          </div>
        </div>
      </main>
    </>
  );
}
