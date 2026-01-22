import { Link, useNavigate, useLocation } from "react-router-dom";
import { Linkedin, Instagram, Youtube, Github } from "lucide-react";
import logo from "@/assets/hackers-unity-logo.png";

const footerLinks = {
  company: [
    { name: "About Us", href: "/about-us", isRoute: true },
    { name: "Careers", href: "/careers", isRoute: true },
    { name: "Workshops", href: "/workshops", isRoute: true },
  ],
  programs: [
    { name: "Hackathons", href: "/hackathons", isRoute: true },
    { name: "Events", href: "#events", isRoute: false },
  ],
  resources: [
    { name: "FAQs", href: "/faqs", isRoute: true },
    { name: "Support", href: "/support", isRoute: true },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy-policy", isRoute: true },
    { name: "Terms of Service", href: "/terms-of-service", isRoute: true },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/company/hackerunity/posts/?feedView=all", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/hackerunity/", label: "Instagram" },
  { icon: Youtube, href: "http://www.youtube.com/@HackerUnity", label: "YouTube" },
  { icon: Github, href: "https://github.com/Hackers-Unity", label: "GitHub" },
];

interface FooterLink {
  name: string;
  href: string;
  isRoute: boolean;
}

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (e: React.MouseEvent, link: FooterLink) => {
    if (!link.isRoute && link.href.startsWith("#")) {
      e.preventDefault();
      const sectionId = link.href.substring(1);
      
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderLink = (link: FooterLink) => {
    if (link.isRoute) {
      return (
        <Link
          key={link.name}
          to={link.href}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {link.name}
        </Link>
      );
    }
    return (
      <a
        key={link.name}
        href={link.href}
        onClick={(e) => handleLinkClick(e, link)}
        className="text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        {link.name}
      </a>
    );
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container-custom py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" onClick={handleLogoClick} className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Hacker's Unity" width={56} height={56} className="h-14 w-auto" />
            </a>
            <p className="text-sm text-muted-foreground mb-6">
              India's leading tech community empowering developers, innovators, and technology enthusiasts.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>{renderLink(link)}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Programs</h4>
            <ul className="space-y-3">
              {footerLinks.programs.map((link) => (
                <li key={link.name}>{renderLink(link)}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>{renderLink(link)}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>{renderLink(link)}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 Hacker's Unity. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
