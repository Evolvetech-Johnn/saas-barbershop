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
      if (!content) return;
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    const setCanonicalUrl = () => {
      const canonicalUrl = window.location.href.split('?')[0]; // Remove query params
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonicalUrl);
      return canonicalUrl;
    };

    const currentUrl = setCanonicalUrl();

    // Standard meta
    setMetaTag('description', description);

    // Open Graph
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:url', currentUrl, true);
    setMetaTag('og:site_name', title.split(' | ')[0] || 'Barbearia', true);

    // Image with fallback
    const defaultImage = `https://placehold.co/1200x630/0F0F23/CA8A04.png?text=${encodeURIComponent(title.split(' | ')[0] || 'Barbearia')}`;
    setMetaTag('og:image', logoUrl || defaultImage, true);
    setMetaTag('twitter:card', 'summary_large_image');

    return () => {
      document.title = originalTitle;
      const removeTag = (selector: string) => {
        const tag = document.querySelector(selector);
        if (tag) tag.remove();
      };
      
      removeTag('meta[name="description"]');
      removeTag('meta[property="og:title"]');
      removeTag('meta[property="og:description"]');
      removeTag('meta[property="og:type"]');
      removeTag('meta[property="og:url"]');
      removeTag('meta[property="og:site_name"]');
      removeTag('meta[property="og:image"]');
      removeTag('meta[name="twitter:card"]');
      removeTag('link[rel="canonical"]');
    };
  }, [title, description, logoUrl]);
};
