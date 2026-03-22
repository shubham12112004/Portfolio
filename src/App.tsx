/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useMotionValueEvent, useTransform } from 'motion/react';
import { 
  User, 
  Code2, 
  Briefcase, 
  GraduationCap, 
  Mail, 
  Github, 
  Linkedin, 
  ExternalLink,
  Menu,
  X,
  Send,
  Download,
  FileJson,
  Palette,
  Globe,
  Server,
  Database,
  Zap,
  Box,
  GitBranch,
  Cloud,
  Figma,
  Layers,
  ChevronDown,
  ArrowRight,
  Calendar,
  Sun,
  Moon
} from 'lucide-react';
import { Skill, Project, Experience, Certification } from './types';
import { SKILLS, PROJECTS, EXPERIENCES, CERTIFICATIONS, PROFILE, HERO_STATS, CURRENTLY_LEARNING } from './constants';
import { CertificateModal } from './components/CertificateModal';
import { googleTranslateService } from './services/googleTranslateService';
import mineImage from '../Certificates/Mine.png';

const ICON_MAP: Record<string, any> = {
  Code2, FileJson, Palette, Globe, Server, Database, Zap, Box, GitBranch, Cloud, Figma
};

const NAV_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Contact', href: '#contact' },
];

const ACCENT_OPTIONS = [
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Rose', value: '#f43f5e' },
];

const LANGUAGE_OPTIONS = [
  { name: 'English', value: 'en' },
  { name: 'Hindi', value: 'hi' },
  { name: 'Spanish', value: 'es' },
  { name: 'French', value: 'fr' },
  { name: 'German', value: 'de' },
  { name: 'Italian', value: 'it' },
  { name: 'Portuguese', value: 'pt' },
  { name: 'Russian', value: 'ru' },
  { name: 'Japanese', value: 'ja' },
  { name: 'Korean', value: 'ko' },
  { name: 'Chinese (Simplified)', value: 'zh-CN' },
  { name: 'Arabic', value: 'ar' },
  { name: 'Bengali', value: 'bn' },
  { name: 'Tamil', value: 'ta' },
  { name: 'Telugu', value: 'te' },
  { name: 'Marathi', value: 'mr' },
  { name: 'Gujarati', value: 'gu' },
  { name: 'Punjabi', value: 'pa' },
  { name: 'Urdu', value: 'ur' },
  { name: 'Turkish', value: 'tr' },
  { name: 'Indonesian', value: 'id' },
  { name: 'Vietnamese', value: 'vi' },
];

interface DropdownOption {
  name: string;
  value: string;
}

interface NavDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  icon: React.ComponentType<{ size?: number }>;
  ariaLabel: string;
  showColorDot?: boolean;
  displayValue?: string;
}

function NavDropdown({ options, value, onChange, icon: Icon, ariaLabel, showColorDot = false, displayValue }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selected = options.find((item) => item.value === value) || options[0];

  useEffect(() => {
    const onOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, []);

  return (
    <div className="relative notranslate" translate="no" ref={rootRef}>
      <button
        type="button"
        className="nav-control-shell nav-control-button notranslate"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        translate="no"
      >
        {showColorDot && <span className="control-dot" style={{ backgroundColor: selected.value }} />}
        <Icon size={14} />
        <span className="nav-control-value notranslate" translate="no">{displayValue || selected.name}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="nav-dropdown-menu custom-scrollbar notranslate"
            translate="no"
          >
            {options.map((item) => {
              const active = item.value === value;
              return (
                <button
                  key={item.value}
                  type="button"
                  className={`nav-dropdown-item ${active ? 'nav-dropdown-item-active' : ''}`}
                  onClick={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  translate="no"
                >
                  {showColorDot && <span className="control-dot" style={{ backgroundColor: item.value }} />}
                  <span className="notranslate" translate="no">{item.name}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  idx: number;
  translate: (text: string) => string;
  key?: string;
}

function ProjectCard({ project, idx, translate }: ProjectCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.8 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        y: -6,
        scale: 1.01,
      }}
      className="glass-card rounded-[2rem] overflow-hidden group border-white/5 perspective-1000 project-shell"
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative overflow-hidden aspect-video md:aspect-auto">
          <img 
            src={project.thumbnail} 
            alt={translate(project.title)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 to-transparent md:hidden" />
          <div className="absolute inset-0 project-image-shine" />
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center" style={{ transform: "translateZ(50px)" }}>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.map(tech => (
              <span key={tech} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400">
                {tech}
              </span>
            ))}
          </div>
          <h3 className="text-3xl font-display font-bold text-white mb-4">{translate(project.title)}</h3>
          <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
            {translate(project.description)}
          </p>
          <div className="flex items-center gap-6">
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent font-bold hover:gap-3 transition-all">
              {translate('Live Demo')} <ExternalLink size={18} />
            </a>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 font-bold hover:text-white transition-colors">
              {translate('GitHub')} <Github size={18} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const defaultAccent = '#06b6d4';
  const defaultLanguage = 'en';
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeRole, setActiveRole] = useState(0);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [accentColor, setAccentColor] = useState(defaultAccent);
  const [language, setLanguage] = useState(defaultLanguage);
  const [themeTransition, setThemeTransition] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certification | null>(null);
  const aboutProfileImage = mineImage;

  const handleLanguageChange = useCallback((value: string) => {
    setLanguage(value);
    window.localStorage.setItem('portfolio-language', value);

    // Apply language using Google Translate widget
    googleTranslateService.setLanguage(value).catch((error) => {
      console.error('Language change failed:', error);
    });
  }, []);

  const roles = [
    'BTech CSE Student',
    'Full Stack Developer',
    'Problem Solver',
    'Open Source Learner'
  ];

  // Keep the custom dropdown and Google bar in sync.
  useEffect(() => {
    const unsubscribe = googleTranslateService.onLanguageChange((nextLanguage) => {
      setLanguage((prev) => {
        if (prev === nextLanguage) return prev;
        window.localStorage.setItem('portfolio-language', nextLanguage);
        return nextLanguage;
      });
    });

    const savedLanguage = window.localStorage.getItem('portfolio-language') || defaultLanguage;
    setLanguage(savedLanguage);
    googleTranslateService.setLanguage(savedLanguage).catch((error) => {
      console.warn('Failed to apply saved language:', error);
    });

    return unsubscribe;
  }, [defaultLanguage]);

  // Translation helper
  const tr = useCallback((text: string) => {
    return text; // Text is translated via Google Translate widget
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 };
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    };
    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));
    return () => sections.forEach(section => observer.unobserve(section));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveRole((prev) => (prev + 1) % roles.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [roles.length]);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('portfolio-theme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    const storedAccent = window.localStorage.getItem('portfolio-accent');
    if (storedAccent && /^#[0-9A-Fa-f]{6}$/.test(storedAccent)) {
      setAccentColor(storedAccent);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeTransition(true);
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    window.setTimeout(() => setThemeTransition(false), 380);
  }, []);

  return (
    <div className="app-shell min-h-screen overflow-x-hidden relative" data-theme={theme}>
      <div className="bg-glow">
        <div className="bg-glow-blob top-0 left-0" />
        <div className="bg-glow-blob bottom-0 right-0" style={{ animationDelay: '-10s' }} />
      </div>
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loader" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="noise-overlay" />
            
            <ScrollProgress />
            
            {/* Navbar */}
            <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'glass-navbar py-4 shadow-2xl' : 'bg-transparent py-6'}`}>
              <div className="max-w-[1280px] mx-auto px-6 lg:px-8 grid grid-cols-[auto_1fr_auto] items-center gap-6">
                <motion.a 
                  href="#home"
                  whileHover={{ scale: 1.05 }}
                  className="text-2xl font-display font-bold text-white tracking-tighter flex items-center gap-1"
                >
                  Shubham<span className="text-accent">.</span>
                </motion.a>

                {/* Desktop Nav */}
                  <div className="hidden md:flex items-center justify-center gap-8 lg:gap-10">
                    {NAV_LINKS.map((link, idx) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className={`nav-link group ${activeSection === link.href.slice(1) ? 'nav-link-active' : ''}`}
                        onMouseEnter={() => {
                          const progress = (idx + 1) / NAV_LINKS.length;
                          window.dispatchEvent(new CustomEvent('nav-hover', { detail: progress }));
                        }}
                        onMouseLeave={() => {
                          window.dispatchEvent(new CustomEvent('nav-hover', { detail: null }));
                        }}
                      >
                        {tr(link.name)}
                        <motion.span 
                          className="absolute bottom-0 left-0 w-full h-px bg-accent origin-left"
                          initial={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </a>
                    ))}
                  </div>
                  <div className="hidden md:flex items-center justify-end gap-3 lg:gap-4">
                    <motion.a 
                      href="#contact" 
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary py-2 px-7 text-sm whitespace-nowrap"
                    >
                      {tr('Hire Me')}
                    </motion.a>
                    <NavDropdown
                      options={LANGUAGE_OPTIONS}
                      value={language}
                      onChange={handleLanguageChange}
                      icon={Globe}
                      ariaLabel="Language selector"
                    />
                    <NavDropdown
                      options={ACCENT_OPTIONS}
                      value={accentColor}
                      onChange={setAccentColor}
                      icon={Palette}
                      ariaLabel="Accent color selector"
                      showColorDot
                    />
                    <button
                      aria-label="Toggle theme"
                      onClick={toggleTheme}
                      className="theme-toggle"
                    >
                      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                  </div>

                {/* Mobile Menu Toggle */}
                <button 
                  className="md:hidden text-[var(--text-primary)]"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, x: '100%' }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: '100%' }}
                  className="fixed inset-0 z-[100] bg-[var(--panel-strong)] flex flex-col items-center justify-center gap-8 md:hidden"
                >
                  <button 
                    className="absolute top-6 right-6 text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <X size={32} />
                  </button>
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-3xl font-display font-bold text-zinc-400 hover:text-white transition-colors"
                    >
                      {tr(link.name)}
                    </a>
                  ))}
                  <button
                    aria-label="Toggle theme"
                    onClick={toggleTheme}
                    className="theme-toggle"
                  >
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                  <NavDropdown
                    options={ACCENT_OPTIONS}
                    value={accentColor}
                    onChange={setAccentColor}
                    icon={Palette}
                    ariaLabel="Accent color selector"
                    showColorDot
                  />
                  <NavDropdown
                    options={LANGUAGE_OPTIONS}
                    value={language}
                    onChange={handleLanguageChange}
                    icon={Globe}
                    ariaLabel="Language selector"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div id="google_translate_element_mount" className="translate-mount" />

            <main>
              {/* 1. Hero Section */}
              <section id="home" className="min-h-screen flex items-center justify-center relative bg-grid premium-spotlight overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
                <div className="orbital-ring orbital-ring-one" />
                <div className="orbital-ring orbital-ring-two" />
                <div className="section-container text-center relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-6">
                      {tr('Available for new projects')}
                    </div>
                    <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-6 tracking-tight leading-none">
                      {tr("Hi, I'm")} <span className="text-gradient">Shubham</span>
                    </h1>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={roles[activeRole]}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.35 }}
                        className="text-2xl md:text-3xl font-medium text-zinc-300 mb-4 role-highlight"
                      >
                        {tr(roles[activeRole])}
                      </motion.p>
                    </AnimatePresence>
                    <p className="text-zinc-500 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                      {tr('I build reliable and polished web applications with a strong focus on clean architecture, performance, and product-level user experience.')}
                    </p>
                    <div className="mb-10 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
                      {HERO_STATS.map((item, idx) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.08, duration: 0.5 }}
                          whileHover={{ y: -3, scale: 1.01 }}
                          className="glass-card rounded-2xl py-4 px-5 border-white/10 stat-card"
                        >
                          <AnimatedCounter target={item.value} suffix={item.suffix} />
                          <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 mt-1">{tr(item.label)}</div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <motion.a 
                        href="#projects" 
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-primary w-full sm:w-auto px-8 py-4"
                      >
                        {tr('View Projects')} <ArrowRight size={18} />
                      </motion.a>
                      <motion.a 
                        href={PROFILE.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/10 bg-white/5 text-white font-bold transition-all flex items-center justify-center gap-2"
                      >
                        {tr('Download CV')} <Download size={18} />
                      </motion.a>
                    </div>
                  </motion.div>
                </div>
                <motion.div 
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-500 cursor-pointer"
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <ChevronDown size={32} className="animate-bounce" />
                </motion.div>
              </section>

              {/* 2. About Section */}
              <section id="about" className="bg-zinc-950/50">
                <div className="section-container">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-3xl mx-auto text-center"
                  >
                    <div className="mb-8 flex justify-center">
                      <div className="relative w-40 md:w-52 aspect-square rounded-full overflow-hidden border-2 border-white/15 shadow-[0_0_40px_rgba(6,182,212,0.15)] about-avatar-shell">
                        <span className="about-avatar-ring" />
                        <img
                          src={aboutProfileImage}
                          alt="Shubham profile"
                          className="w-full h-full rounded-full object-cover object-[84%_16%]"
                        />
                      </div>
                    </div>

                    <div className="text-accent text-sm font-bold uppercase tracking-widest mb-4">{tr('About Me')}</div>
                    <h2 className="text-4xl font-display font-bold text-white mb-6">{tr('BTech CSE Student & Full Stack Developer')}</h2>
                    <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                      {tr("I'm a passionate BTech CSE student building full-stack web applications with a focus on clean code, scalable architecture, and user-centric design. My recent projects include movie recommendation systems, ticket management platforms, and community assistance applications.")}
                    </p>
                    <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                      {tr("I'm actively learning system design, competitive programming, and advanced web technologies. Check out my work on GitHub and explore my recent deployments on Vercel.")}
                    </p>
                    <a
                      href={PROFILE.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      {tr('Download Full CV')} <Download size={18} />
                    </a>
                  </motion.div>
                </div>
              </section>

              {/* 3. Featured Projects */}
              <section id="projects" className="bg-grid">
                <div className="section-container">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                  >
                    <div className="text-accent text-sm font-bold uppercase tracking-widest mb-4">{tr('Portfolio')}</div>
                    <h2 className="text-5xl font-display font-bold text-white mb-4">{tr('Featured Projects')}</h2>
                  </motion.div>

                  <div className="grid gap-12">
                    {PROJECTS.map((project, idx) => (
                      <ProjectCard key={project.id} project={project} idx={idx} translate={tr} />
                    ))}
                  </div>
                </div>
              </section>

              {/* 4. Skills Section */}
              <section id="skills" className="bg-zinc-950/50">
                <div className="section-container">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                  >
                    <div className="text-accent text-sm font-bold uppercase tracking-widest mb-4">{tr('Expertise')}</div>
                    <h2 className="text-5xl font-display font-bold text-white mb-4">{tr('Technical Skills')}</h2>
                  </motion.div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {SKILLS.map((skill, idx) => {
                      const Icon = ICON_MAP[skill.icon] || Code2;
                      return (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ 
                            scale: 1.02,
                          }}
                          className="glass-card p-6 rounded-2xl flex items-center gap-4 group cursor-default border-white/5"
                        >
                          <div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                            <Icon size={24} />
                          </div>
                          <div>
                            <div className="text-white font-bold">{tr(skill.name)}</div>
                            <div className="text-zinc-500 text-xs uppercase tracking-widest">{tr(skill.category)}</div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* 5. Currently Learning Ticker */}
              <section className="bg-grid overflow-hidden">
                <div className="section-container pt-10 pb-14">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8"
                  >
                    <div className="text-accent text-sm font-bold uppercase tracking-widest mb-3">{tr('Growth Track')}</div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">{tr('Currently Learning')}</h2>
                    <p className="text-zinc-500 max-w-2xl mx-auto">
                      {tr('Focused on core CSE depth and production-ready full-stack engineering.')}
                    </p>
                  </motion.div>

                  <div className="learning-ticker-wrap">
                    <div className="learning-ticker-track">
                      {[...CURRENTLY_LEARNING, ...CURRENTLY_LEARNING].map((item, idx) => (
                        <span key={`${item}-${idx}`} className="learning-chip">
                          <span className="learning-chip-dot" />
                          {tr(item)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* 6. Experience Section */}
              <section id="experience" className="bg-grid">
                <div className="section-container">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                  >
                    <div className="text-accent text-sm font-bold uppercase tracking-widest mb-4">{tr('Journey')}</div>
                    <h2 className="text-4xl font-display font-bold text-white">{tr('Experience')}</h2>
                  </motion.div>
                  
                  <div className="max-w-3xl space-y-8">
                    {EXPERIENCES.map((exp, idx) => (
                      <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.6 }}
                        whileHover={{ x: 4 }}
                        className="relative pl-8 border-l border-white/10"
                      >
                        <div className="absolute top-0 left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-accent shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                        <div className="timeline-card rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                          <div className="text-accent text-sm font-bold mb-1">{tr(exp.duration)}</div>
                          <h3 className="text-xl font-bold text-white mb-1">{tr(exp.role)}</h3>
                          <div className="text-zinc-400 font-medium mb-3">{tr(exp.company)}</div>
                          <p className="text-zinc-500 leading-relaxed">{tr(exp.description)}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 7. Certifications Section */}
              <section id="certifications" className="bg-zinc-950">
                <div className="section-container">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                  >
                    <div className="text-accent text-sm font-bold uppercase tracking-widest mb-4">{tr('Learning')}</div>
                    <h2 className="text-4xl font-display font-bold text-white">{tr('Certifications')}</h2>
                    <p className="text-zinc-500 mt-3">{CERTIFICATIONS.length} {tr('credentials uploaded and showcased.')}</p>
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {CERTIFICATIONS.map((cert, idx) => (
                      <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.6 }}
                        whileHover={{ 
                          y: -5,
                          scale: 1.01,
                        }}
                        className="glass-card rounded-2xl overflow-hidden border-white/5 cursor-pointer group transition-all flex flex-col h-full"
                        onClick={() => setSelectedCertificate(cert)}
                      >
                        <div className="aspect-[4/3] overflow-hidden border-b border-white/10 relative">
                          <img 
                            src={cert.image} 
                            alt={cert.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 certificate-overlay" />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="text-accent text-xs font-bold uppercase tracking-widest mb-2">{tr(cert.organization)}</div>
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors line-clamp-2">{tr(cert.title)}</h3>
                          <div className="mt-auto text-zinc-500 text-sm flex items-center gap-2">
                            <Calendar size={14} />
                            {tr(cert.date)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 8. Contact Section */}
              <section id="contact" className="bg-zinc-950 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
                <div className="section-container relative z-10">
                  <div className="grid md:grid-cols-2 gap-16">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                        <div className="text-accent text-sm font-bold uppercase tracking-widest mb-4">{tr('Contact')}</div>
                      <h2 className="text-5xl font-display font-bold text-white mb-6 leading-tight">
                          {tr('Let’s build something')} <span className="text-gradient">{tr('impactful')}</span> {tr('together')}
                      </h2>
                      <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
                          {tr('I am actively looking for internships and entry-level SDE opportunities where I can contribute, learn fast, and build meaningful products.')}
                      </p>
                      
                      <div className="space-y-6">
                        <a href={`mailto:${PROFILE.email}`} className="flex items-center gap-4 text-zinc-400 hover:text-white transition-colors group">
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent/10 group-hover:text-accent transition-all">
                            <Mail size={20} />
                          </div>
                          <span className="text-lg font-medium">{PROFILE.email}</span>
                        </a>
                        <div className="flex gap-4">
                          {[
                            { icon: Github, href: PROFILE.githubUrl, label: 'GitHub' },
                            { icon: Linkedin, href: PROFILE.linkedInUrl, label: 'LinkedIn' },
                            { icon: Globe, href: PROFILE.websiteUrl, label: 'Website' }
                          ].map((social, i) => (
                            <a 
                              key={i} 
                              href={social.href} 
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={social.label}
                              className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-accent/10 hover:text-accent transition-all"
                            >
                              <social.icon size={20} />
                            </a>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="glass-card p-8 rounded-[2rem] border-white/5 contact-form-shell"
                    >
                      <form
                        className="space-y-6"
                        action={`https://formsubmit.co/${PROFILE.email}`}
                        method="POST"
                      >
                        <input type="hidden" name="_subject" value={tr('New portfolio contact message')} />
                        <input type="hidden" name="_captcha" value="false" />
                        <input type="hidden" name="_template" value="table" />
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{tr('Name')}</label>
                            <input name="name" type="text" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-all focus:ring-2 focus:ring-accent/20" placeholder="John Doe" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{tr('Email')}</label>
                            <input name="email" type="email" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-all focus:ring-2 focus:ring-accent/20" placeholder="john@example.com" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{tr('Message')}</label>
                          <textarea name="message" rows={4} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-all focus:ring-2 focus:ring-accent/20 resize-none" placeholder={tr('Your message here...')} />
                        </div>
                        <motion.button 
                          type="submit" 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="btn-primary w-full py-4"
                        >
                          {tr('Send Message')} <Send size={18} />
                        </motion.button>
                      </form>
                    </motion.div>
                  </div>
                </div>
              </section>
            </main>

            {/* Footer */}
            <footer className="bg-zinc-950 py-12 border-t border-white/5">
              <div className="max-w-5xl mx-auto px-6 text-center">
                <div className="text-2xl font-display font-bold text-white mb-4">
                  S<span className="text-accent">.</span>
                </div>
                <p className="text-zinc-500 text-sm">
                  © {new Date().getFullYear()} Shubham. {tr('Engineered with React, TypeScript, and intent.')}
                </p>
              </div>
            </footer>
            
            <AnimatePresence>
              {selectedCertificate && (
                <CertificateModal 
                  certificate={selectedCertificate} 
                  onClose={() => setSelectedCertificate(null)} 
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {themeTransition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="theme-flash"
          />
        )}
      </AnimatePresence>
      <CursorFollower />
    </div>
  );
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1100;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, target]);

  return (
    <div ref={ref} className="text-2xl font-display font-bold text-white">
      {count}{suffix}
    </div>
  );
}

function LoadingScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center gap-6"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-5xl font-display font-bold text-white tracking-tighter"
      >
        S<span className="text-accent">.</span>
      </motion.div>
      <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-accent shadow-[0_0_20px_rgba(6,182,212,1)]"
        />
      </div>
    </motion.div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const [hoverProgress, setHoverProgress] = useState<number | null>(null);
  
  const targetProgress = useMotionValue(0);
  const springProgress = useSpring(targetProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleNavHover = (e: any) => setHoverProgress(e.detail);
    window.addEventListener('nav-hover', handleNavHover);
    return () => window.removeEventListener('nav-hover', handleNavHover);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (hoverProgress === null) {
      targetProgress.set(latest);
    }
  });

  useEffect(() => {
    if (hoverProgress !== null) {
      targetProgress.set(hoverProgress);
    } else {
      targetProgress.set(scrollYProgress.get());
    }
  }, [hoverProgress, scrollYProgress, targetProgress]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-[110] shadow-[0_0_15px_rgba(6,182,212,0.6)]"
      style={{ scaleX: springProgress }}
    />
  );
}

function CursorFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-accent/50 pointer-events-none z-[9999] hidden lg:block"
      animate={{
        x: position.x - 16,
        y: position.y - 16,
        scale: isPointer ? 1.5 : 1,
        backgroundColor: isPointer ? 'rgba(6, 182, 212, 0.1)' : 'transparent'
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
    />
  );
}
