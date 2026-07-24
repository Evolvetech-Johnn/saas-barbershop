import { useEffect } from 'react';

interface SchemaProps {
  nome: string;
  logoUrl?: string;
  descricaoPublica?: string;
  telefone?: string;
  endereco?: string;
  horarioFuncionamento?: string;
}

export const useLocalBusinessSchema = (tenant: SchemaProps | null | undefined) => {
  useEffect(() => {
    if (!tenant) return;

    const scriptId = 'schema-local-business';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "HairSalon",
      "name": tenant.nome,
      "image": tenant.logoUrl,
      "description": tenant.descricaoPublica,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": tenant.endereco
      },
      "telephone": tenant.telefone,
      "openingHours": tenant.horarioFuncionamento
    };

    script.textContent = JSON.stringify(schemaData);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [tenant]);
};
