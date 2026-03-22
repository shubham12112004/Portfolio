import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Download, ExternalLink, Calendar, Building2 } from 'lucide-react';
import { Certification } from '../types';

interface CertificateModalProps {
  certificate: Certification;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl glass-card rounded-3xl overflow-hidden border-white/10 flex flex-col md:flex-row shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
        >
          <X size={20} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-3/5 bg-zinc-900 flex items-center justify-center p-4 md:p-0">
          <img 
            src={certificate.image} 
            alt={certificate.title} 
            className="w-full h-full object-contain max-h-[40vh] md:max-h-full"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Info Section */}
        <div className="w-full md:w-2/5 p-8 flex flex-col justify-between bg-zinc-950/50 backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-4">
              <span className="w-8 h-[1px] bg-accent" />
              Certification Details
            </div>
            
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 leading-tight">
              {certificate.title}
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-zinc-400">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent">
                  <Building2 size={18} />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">Organization</div>
                  <div className="text-white font-medium">{certificate.organization}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-zinc-400">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent">
                  <Calendar size={18} />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">Issued Date</div>
                  <div className="text-white font-medium">{certificate.date}</div>
                </div>
              </div>
            </div>

            <p className="text-zinc-400 leading-relaxed mb-8">
              {certificate.description}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a 
              href={certificate.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-2xl bg-accent text-white font-bold hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <Download size={18} /> Download Certificate
            </a>
            <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <ExternalLink size={18} /> Verify Credential
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
