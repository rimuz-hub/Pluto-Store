import { FaInstagram, FaWhatsapp, FaDiscord } from 'react-icons/fa';
import { siteSettings } from '../siteSettings';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
        <div>
          <h3 className="text-lg font-semibold text-brand-700 dark:text-brand-200">{siteSettings.shopName}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Premium commerce experience for modern businesses.</p>
        </div>
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          {siteSettings.socials.instagram && (
            <a href={siteSettings.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-brand-700"><FaInstagram /></a>
          )}
          {siteSettings.socials.whatsapp && (
            <a href={siteSettings.socials.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-brand-700"><FaWhatsapp /></a>
          )}
          {siteSettings.socials.discord && (
            <a href={siteSettings.socials.discord} target="_blank" rel="noopener noreferrer" aria-label="Discord" className="hover:text-brand-700"><FaDiscord /></a>
          )}
        </div>
      </div>
      <div className="mt-6 border-t border-slate-200 pt-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">{siteSettings.footerText}</div>
    </footer>
  );
}
