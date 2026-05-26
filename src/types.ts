export interface Scholarship {
  _id: string;
  title: string;
  country: string;
  region?: string;
  level: string;
  university: string;
  description: string;
  deadline?: string;
  applyLink?: string;
  image?: string;
  imageAltText?: string;
  isUpcoming?: boolean;
  createdAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  image?: string;
  imageAltText?: string;
  createdAt: string;
}

export interface Country {
  _id: string;
  name: string;
  image?: string;
  scholarshipCount?: number;
}

export interface Ad {
  _id: string;
  type: "image" | "script" | "html" | "google_ads";
  placement: "home" | "sidebar" | "footer" | "between_content" | "over_navbar" | "header";
  content: string;
  active: boolean;
}

export interface Carousel {
  _id: string;
  title?: string;
  image: string;
  imageAltText?: string;
  description?: string;
  link?: string;
  order: number;
}

export interface Video {
  _id: string;
  title: string;
  youtubeLink: string;
  description?: string;
  order: number;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  iconName?: string;
  colorClass?: string;
  iconColorClass?: string;
  order: number;
  createdAt?: string;
}

export interface Settings {
  siteName: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
    portfolio?: string;
    whatsapp?: string;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  helpPage?: {
    title?: string;
    description?: string;
  };
  systemEmail?: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface Subscriber {
  _id: string;
  email: string;
  createdAt: string;
}
