// lib/types.ts

// Insurance types
export interface InsuranceOption {
  id: string;
  title: string;
  description: string;
  coverageList?: string[];
}

export interface InsuranceType {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  description: string;
  options: InsuranceOption[];
  buttonHref: string;
}

// Testimonials
export interface Testimonial {
  id: number;
  name: string;
  position: string;
  content: string;
  rating: number;
  insurance: string;
}

// Customer service
export interface InsuranceCompany {
  id: string;
  name: string;
  logo: string;
  phone: string;
  emergencyPhone?: string;
}

// Payments
export interface PaymentProvider {
  id: string;
  name: string;
  logo: string;
  url: string;
}

export interface PaymentTab {
  id: string;
  label: string;
  icon: React.ElementType;
}

// WhatsApp form
export interface WhatsAppFormData {
  name: string;
  phone: string;
  idNumber: string;
}