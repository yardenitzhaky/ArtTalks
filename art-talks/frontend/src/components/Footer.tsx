// Footer: social links + current year
import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // External profiles and contact
  const socialLinks = [
    {
      icon: "🌐",
      url: "https://yardenitzhaky.github.io/Portfolio/",
      label: "Portfolio"
    },
    {
      icon: "💼",
      url: "https://www.linkedin.com/in/yardenitzhaky",
      label: "LinkedIn"
    },
    {
      icon: "🔗",
      url: "https://github.com/yardenitzhaky",
      label: "GitHub"
    },
    {
      icon: "✉️",
      url: "mailto:yardene015@gmail.com",
      label: "Email"
    }
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="social-links">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="social-icon"
              title={link.label}
            >
              {link.icon}
            </a>
          ))}
        </div>

        <p className="copyright">
          <span>©</span>
          <span>{currentYear}</span>
          <span className="separator">|</span>
          <span className="creator">Created by Yarden Itzhaky</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;