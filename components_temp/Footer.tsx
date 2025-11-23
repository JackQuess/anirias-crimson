import React from 'react';
import { Github, Twitter, Heart } from 'lucide-react';
import { useTranslation } from '../providers/I18nProvider';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#020202] border-t border-white/5 py-12">
      <div className="container mx-auto px-4 text-center">
        
        <h2 className="text-2xl font-cinzel font-bold text-white mb-4 tracking-wider">
          ANI<span className="text-anirias-crimson">RIAS</span>
        </h2>
        
        <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
          {t('Footer.tagline')}
        </p>

        <div className="flex justify-center gap-6 mb-8">
          <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
          <a href="#" className="text-gray-500 hover:text-anirias-crimson transition-colors"><Heart className="w-5 h-5" /></a>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-gray-600 uppercase tracking-widest font-bold">
          <a href="#" className="hover:text-white transition-colors">{t('Footer.terms')}</a>
          <a href="#" className="hover:text-white transition-colors">{t('Footer.privacy')}</a>
          <a href="#" className="hover:text-white transition-colors">DMCA</a>
          <a href="#" className="hover:text-white transition-colors">{t('Footer.contact')}</a>
        </div>
        
        <div className="mt-8 text-[10px] text-gray-700">
          © {new Date().getFullYear()} Anirias. All rights reserved. This is a demo project.
        </div>
      </div>
    </footer>
  );
};

export default Footer;