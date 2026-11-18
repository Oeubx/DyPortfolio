export interface PortfolioConfig {
  personal: {
    name: string;
    titles: string[];
    bio: string;
    location: string;
    emailPersonal: string;
    emailProfessional: string;
    socials: {
      linkedin?: string;
      github?: string;
      x?: string;
      facebook?: string;
    };
  };
  navigation: {
    links: Array<{ name: string; href: string }>;
  };
  roles: {
    presets: Array<{
      id: string;
      label: string;
      description: string;
      defaultTags: string[];
    }>;
  };
}

export const portfolioConfig: PortfolioConfig = {
  personal: {
    name: "Prince Amorsolo C. Remo",
    titles: [
      "Fullstack Software Engineer",
      "System Architect",
      "Tech Innovator"
    ],
    bio: "Passionate developer focused on building scalable, dynamic web systems, intuitive interfaces, and high-reliability software architectures.",
    location: "Philippines",
    emailPersonal: "oeubxwaa@gmail.com",
    emailProfessional: "oeubxwaa@gmail.com",
    socials: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      x: "https://x.com",
      facebook: "https://facebook.com"
    }
  },
  navigation: {
    links: [
      { name: "Home", href: "#home" },
      { name: "Projects", href: "#projects" },
      { name: "Experiences", href: "#experiences" },
      { name: "Certificates", href: "#certificates" },
      { name: "About", href: "#about" },
      { name: "Dynamic Resume", href: "#resume" }
    ]
  },
  roles: {
    presets: [
      {
        id: "developer",
        label: "Software Developer",
        description: "Focuses on engineering, backend systems, APIs, and modern frontend frameworks.",
        defaultTags: ["developer", "frontend", "backend", "fullstack"]
      },
      {
        id: "systems",
        label: "Systems & Architecture",
        description: "Highlights database design, infrastructure, DevOps, and reliability.",
        defaultTags: ["systems", "database", "devops", "architecture"]
      },
      {
        id: "custom",
        label: "Custom Selection",
        description: "Fully customizable checklist allowing manual selection of individual items.",
        defaultTags: []
      }
    ]
  }
};
