import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  logoUrl?: string;
}

export const usePublicSeo = ({ title, description, logoUrl }: SeoProps) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title;

    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMetaTag('description', description);
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('twitter:card', 'summary_large_image');
    if (logoUrl) {
      setMetaTag('og:image', logoUrl, true);
    }

    return () => {
      document.title = originalTitle;
      const removeMetaTag = (name: string, isProperty = false) => {
        const attribute = isProperty ? 'property' : 'name';
        const meta = document.querySelector(`meta[${attribute}="${name}"]`);
        if (meta) {
          meta.remove();
        }
      };
      removeMetaTag('description');
      removeMetaTag('og:title', true);
      removeMetaTag('og:description', true);
      removeMetaTag('og:image', true);
      removeMetaTag('twitter:card');
    };
  }, [title, description, logoUrl]);
};
