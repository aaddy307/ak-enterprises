import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ContactForm } from "@/components/sections/ContactForm";
import { contactInfo } from "@/lib/utils";
import dbConnect from "@/lib/db/connect";
import SocialMedia from "@/lib/db/models/SocialMedia";
import Contact from "@/lib/db/models/Contact";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with AK Enterprises. Experience the pinnacle of luxury real estate service.",
};

export default async function ContactPage() {
  let socialLinks = [];
  let dbContactInfo = null;
  try {
    await dbConnect();
    socialLinks = await SocialMedia.find({ isActive: true }).sort({ platform: 1 }).lean();
    dbContactInfo = await Contact.findOne().sort({ createdAt: -1 }).lean();
  } catch (error) {
    console.error("Failed to fetch data for contact page:", error);
  }

  // Fallback links if none exist in the database yet
  if (!socialLinks || socialLinks.length === 0) {
    socialLinks = [
      { platform: "Facebook", url: "https://facebook.com" },
      { platform: "Instagram", url: "https://instagram.com" },
      { platform: "WhatsApp", url: "https://wa.me/919876543210" },
    ];
  }

  const dbPhones = Array.isArray(dbContactInfo?.phone) ? dbContactInfo.phone : [];
  const dbEmails = Array.isArray(dbContactInfo?.email) ? dbContactInfo.email : [];

  const displayContact = {
    address: dbContactInfo?.address || contactInfo.address,
    phones: dbPhones.length > 0 ? dbPhones : [contactInfo.phone],
    emails: dbEmails.length > 0 ? dbEmails : [contactInfo.email],
    hours: dbContactInfo?.workingHours || contactInfo.hours,
  };

  return (
    <>
      <section className="relative h-[409px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/Contact.jpg"
            alt="Luxury skyscraper at twilight"
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
            <span className="text-white/60">Contact Us</span>
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
            Get In Touch
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
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
                    <p className="text-on-surface-variant">{displayContact.address}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Icon name="phone" size={24} className="text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-on-surface font-semibold mb-1">Phone</p>
                    {displayContact.phones.map((phone, idx) => (
                      <a
                        key={idx}
                        href={`tel:${phone}`}
                        className="text-primary hover:underline"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Icon name="mail" size={24} className="text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-on-surface font-semibold mb-1">Email</p>
                    {displayContact.emails.map((email, idx) => (
                      <a
                        key={idx}
                        href={`mailto:${email}`}
                        className="text-primary hover:underline"
                      >
                        {email}
                      </a>
                    ))}
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
                    <p className="text-on-surface-variant">{displayContact.hours}</p>
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
