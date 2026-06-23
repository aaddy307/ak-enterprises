import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { navigation, contactInfo } from "@/lib/utils";
import dbConnect from "@/lib/db/connect";
import SocialMedia from "@/lib/db/models/SocialMedia";

export async function Footer() {
  let socialLinks = [];
  try {
    await dbConnect();
    socialLinks = await SocialMedia.find({ isActive: true }).sort({ platform: 1 }).lean();
  } catch (error) {
    console.error("Failed to fetch social media links for footer:", error);
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
    <footer className="bg-surface-container-lowest border-t border-outline/10">
      <div className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center mb-6">
              <span
                className="font-headline text-xl md:text-2xl font-bold tracking-[0.18em] uppercase text-primary"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                AK Enterprises
              </span>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              Defining excellence in Ambernath&apos;s real estate market through
              unwavering integrity and bespoke property solutions.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((item) => (
                <a
                  key={String(item._id || item.platform)}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary hover:bg-surface-container-high transition-colors"
                  title={item.platform}
                >
                  <Icon name={item.platform} size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-on-surface mb-6 uppercase tracking-wider text-sm">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-on-surface-variant hover:text-primary transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-on-surface mb-6 uppercase tracking-wider text-sm">
              Property Types
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/properties?type=residential"
                  className="text-on-surface-variant hover:text-primary transition-colors text-sm"
                >
                  Residential Apartments
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=residential&subtype=villa"
                  className="text-on-surface-variant hover:text-primary transition-colors text-sm"
                >
                  Luxury Villas
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=commercial"
                  className="text-on-surface-variant hover:text-primary transition-colors text-sm"
                >
                  Commercial Spaces
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?status=new-launch"
                  className="text-on-surface-variant hover:text-primary transition-colors text-sm"
                >
                  New Launches
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-on-surface mb-6 uppercase tracking-wider text-sm">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Icon
                  name="location_on"
                  size={20}
                  className="text-primary mt-0.5"
                />
                <span className="text-on-surface-variant text-sm">
                  {contactInfo.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="phone" size={20} className="text-primary" />
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="text-on-surface-variant hover:text-primary transition-colors text-sm"
                >
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="mail" size={20} className="text-primary" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-on-surface-variant hover:text-primary transition-colors text-sm"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="schedule" size={20} className="text-primary" />
                <span className="text-on-surface-variant text-sm">
                  {contactInfo.hours}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-outline/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-on-surface-variant text-sm">
            © {new Date().getFullYear()} AK Enterprises. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-on-surface-variant hover:text-primary text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-on-surface-variant hover:text-primary text-sm transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
