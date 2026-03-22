import { Skill, Project, Experience, Certification } from './types';
import certImg01 from '../Certificates/Screenshot 2025-08-15 142852.png';
import certImg02 from '../Certificates/Screenshot 2025-08-28 134001.png';
import certImg03 from '../Certificates/Screenshot 2025-08-28 134054.png';
import certImg04 from '../Certificates/Screenshot 2025-08-28 134135.png';
import certImg05 from '../Certificates/Screenshot 2025-09-14 110854.png';
import certImg06 from '../Certificates/Screenshot 2025-09-14 110917.png';
import certImg07 from '../Certificates/Screenshot 2025-09-14 111015.png';
import certImg08 from '../Certificates/Screenshot 2025-09-14 111105.png';
import certImg09 from '../Certificates/Screenshot 2025-12-09 203221.png';
import certImg10 from '../Certificates/Screenshot 2025-12-09 203356.png';
import certImg11 from '../Certificates/Screenshot 2025-12-09 203746.png';
import certImg12 from '../Certificates/Screenshot 2025-12-12 172802.png';
import certImg13 from '../Certificates/Screenshot 2026-03-20 204149.png';
import certImg14 from '../Certificates/Screenshot 2026-03-20 204329.png';
import certImg15 from '../Certificates/NGO.png';
import generalResumePdf from '../Certificates/Shubham General CV.pdf';

export const PROFILE = {
  name: 'Shubham',
  email: 'raoshubham192@gmail.com',
  resumeUrl: generalResumePdf,
  githubUrl: 'https://github.com/shubham12112004',
  linkedInUrl: 'https://www.linkedin.com/in/shubhamyadav20/',
  websiteUrl: 'https://github.com/shubham12112004',
};

export const HERO_STATS = [
  { label: 'Featured Projects', value: 4, suffix: '' },
  { label: 'Certifications', value: 15, suffix: '' },
  { label: 'Internships', value: 1, suffix: '' },
];

export const CURRENTLY_LEARNING = [
  'Data Structures & Algorithms',
  'System Design Basics',
  'Operating Systems Concepts',
  'Computer Networks',
  'DBMS Query Optimization',
  'Advanced TypeScript',
  'Next.js App Router',
  'Node.js Performance Tuning',
  'Docker & Container Workflows',
  'CI/CD with GitHub Actions',
  'Redis Caching Patterns',
  'Testing with Jest + RTL',
];

export const SKILLS: Skill[] = [
  { name: 'React', category: 'Frontend', icon: 'Code2' },
  { name: 'TypeScript', category: 'Frontend', icon: 'FileJson' },
  { name: 'Tailwind CSS', category: 'Frontend', icon: 'Palette' },
  { name: 'Next.js', category: 'Frontend', icon: 'Globe' },
  { name: 'Node.js', category: 'Backend', icon: 'Server' },
  { name: 'PostgreSQL', category: 'Backend', icon: 'Database' },
  { name: 'MongoDB', category: 'Backend', icon: 'Database' },
  { name: 'GraphQL', category: 'Backend', icon: 'Zap' },
  { name: 'Docker', category: 'Tools', icon: 'Box' },
  { name: 'Git', category: 'Tools', icon: 'GitBranch' },
  { name: 'AWS', category: 'Tools', icon: 'Cloud' },
  { name: 'Figma', category: 'Tools', icon: 'Figma' },
];

export const PROJECTS: Project[] = [
  {
    id: '4',
    title: 'ClimaSense AI Weather App',
    description: 'An AI-powered weather intelligence app that provides live forecasts, location-based insights, and conversational weather assistance through a clean, modern interface.',
    thumbnail: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80',
    techStack: ['React', 'TypeScript', 'Vite', 'AI APIs', 'Weather APIs'],
    liveUrl: 'https://climasense-app.vercel.app/',
    githubUrl: 'https://github.com/shubham12112004/ClimaSense',
  },
  {
    id: '1',
    title: 'CineMatch',
    description: 'A smart movie and series discovery platform that recommends the best movies based on your mood, genre, and preferences. Designed with intuitive UI and personalized recommendations.',
    thumbnail: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1200&q=80',
    techStack: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    liveUrl: 'https://cine-match-coral.vercel.app',
    githubUrl: 'https://github.com/shubham12112004/CineMatch',
  },
  {
    id: '2',
    title: 'Help Desk System',
    description: 'A full-stack MERN-based ticket management system with secure JWT authentication and role-based access control. Users can raise support tickets, admins manage and resolve them efficiently.',
    thumbnail: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    techStack: ['React', 'Express', 'MongoDB', 'PostgreSQL', 'JWT'],
    liveUrl: 'https://help-desk-system-rho.vercel.app',
    githubUrl: 'https://github.com/shubham12112004/Help-Desk-System',
  },
  {
    id: '3',
    title: 'Guardia Community Platform',
    description: 'A local community-based emergency assistance platform connecting users with nearby volunteers in real time. Built for rapid response and community support.',
    thumbnail: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80',
    techStack: ['React', 'TypeScript', 'Node.js', 'Real-time APIs'],
    liveUrl: 'https://github.com/shubham12112004/-Guardia-Local-Community-Assistance-Platform',
    githubUrl: 'https://github.com/shubham12112004/-Guardia-Local-Community-Assistance-Platform',
  },
];

export const EXPERIENCES: Experience[] = [
  {
    id: '1',
    company: 'Yuva Unstoppable (NGO)',
    role: 'NGO Intern',
    duration: 'Jun 2024 - Jul 2024',
    description: 'Supported NGO initiatives through community coordination, on-ground activities, and outreach tasks while building communication and team collaboration skills.',
    logo: 'https://images.unsplash.com/photo-1469571486292-b53601020a8a?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: '2',
    company: 'Open Source Program',
    role: 'Frontend Contributor',
    duration: '2024 - Present',
    description: 'Contributed bug fixes and UI improvements to open-source projects, focusing on accessibility, responsive layout quality, and clean TypeScript patterns.',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=120&q=80',
  },
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: '1',
    title: 'Data Structures Algorithms Training',
    organization: 'CipherSchools',
    date: 'Jul 2025',
    image: certImg01,
    description: 'Credential: CSW2025-12026',
    downloadUrl: certImg01,
  },
  {
    id: '2',
    title: 'Master Generative AI & Generative AI Tools',
    organization: 'Udemy',
    date: 'Aug 2025',
    image: certImg02,
    description: 'Credential: UC- (partial)',
    downloadUrl: certImg02,
  },
  {
    id: '3',
    title: 'Build Generative AI Apps and Solutions with No-Code Tools',
    organization: 'Udemy',
    date: 'Aug 2025',
    image: certImg03,
    description: 'Credential: UC- (partial)',
    downloadUrl: certImg03,
  },
  {
    id: '4',
    title: 'ChatGPT Made Easy: AI Essentials for Beginners',
    organization: 'Udemy',
    date: 'Aug 2025',
    image: certImg04,
    description: 'Credential: UC- (partial)',
    downloadUrl: certImg04,
  },
  {
    id: '5',
    title: 'Object Oriented Programming',
    organization: 'Lovely Professional University (iamneo)',
    date: 'Dec 2024',
    image: certImg05,
    description: 'Credential: 25AM05J0K0EB1dm7',
    downloadUrl: certImg05,
  },
  {
    id: '6',
    title: 'Java Programming',
    organization: 'Lovely Professional University (iamneo)',
    date: 'May 2025',
    image: certImg06,
    description: 'Credential: 23KC2DL30MB85j9AKO1',
    downloadUrl: certImg06,
  },
  {
    id: '7',
    title: 'Data Structures and Algorithms',
    organization: 'Lovely Professional University (iamneo)',
    date: 'Dec 2024',
    image: certImg07,
    description: 'Credential: 16Af0098a0hAi00185',
    downloadUrl: certImg07,
  },
  {
    id: '8',
    title: 'Computer Programming',
    organization: 'Lovely Professional University (iamneo)',
    date: 'May 2024',
    image: certImg08,
    description: 'Credential: 24CL25M9AJdK7c16',
    downloadUrl: certImg08,
  },
  {
    id: '9',
    title: 'ChatGPT Prompt Engineering: ChatGPT, Generative AI & LLM',
    organization: 'Infosys Springboard',
    date: 'Aug 2025',
    image: certImg09,
    description: 'Credential: QR based',
    downloadUrl: certImg09,
  },
  {
    id: '10',
    title: 'Computational Theory: Language Principle & Finite Automata',
    organization: 'Infosys Springboard',
    date: 'Aug 2025',
    image: certImg10,
    description: 'Credential: QR based',
    downloadUrl: certImg10,
  },
  {
    id: '11',
    title: 'Build Generative AI Apps and Solutions with No-Code Tools',
    organization: 'Infosys Springboard',
    date: 'Aug 2025',
    image: certImg11,
    description: 'Credential: QR based',
    downloadUrl: certImg11,
  },
  {
    id: '12',
    title: 'Master Generative AI & Generative AI Tools (ChatGPT & more)',
    organization: 'Infosys Springboard',
    date: 'Aug 2025',
    image: certImg12,
    description: 'Credential: QR based',
    downloadUrl: certImg12,
  },
  {
    id: '13',
    title: 'C++ Essentials 1',
    organization: 'Cisco Networking Academy',
    date: 'Nov 2025',
    image: certImg13,
    description: 'Credential: N/A',
    downloadUrl: certImg13,
  },
  {
    id: '14',
    title: 'Cloud Computing',
    organization: 'NPTEL (IIT Kharagpur / SWAYAM)',
    date: 'Jul–Oct 2025',
    image: certImg14,
    description: 'Credential: NPTEL25CS107545870066',
    downloadUrl: certImg14,
  },
  {
    id: '15',
    title: 'Internship Completion Certificate',
    organization: 'Yuva Unstoppable (NGO)',
    date: 'Jun-Jul 2024',
    image: certImg15,
    description: 'Completed NGO internship from 07 Jun 2024 to 12 Jul 2024.',
    downloadUrl: certImg15,
  },
];
