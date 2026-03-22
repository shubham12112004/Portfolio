export interface Skill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Tools';
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  logo?: string;
}

export interface Certification {
  id: string;
  title: string;
  organization: string;
  date: string;
  image: string;
  description: string;
  downloadUrl?: string;
}

export type SectionType = 'about' | 'skills' | 'projects' | 'experience' | 'certifications' | 'contact' | null;
