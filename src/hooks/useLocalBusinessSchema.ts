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

    const currentUrl = window.location.href.split('?')[0];

    const schemaData: any = {
      "@context": "https://schema.org",
      "@type": "HairSalon",
      "name": tenant.nome,
      "url": currentUrl,
    };

    if (tenant.logoUrl) schemaData["image"] = tenant.logoUrl;
    if (tenant.descricaoPublica) schemaData["description"] = tenant.descricaoPublica;
    if (tenant.endereco) {
      schemaData["address"] = {
        "@type": "PostalAddress",
        "streetAddress": tenant.endereco
      };
    }
    if (tenant.telefone) schemaData["telephone"] = tenant.telefone;
    if (tenant.horarioFuncionamento) schemaData["openingHours"] = tenant.horarioFuncionamento;

    script.textContent = JSON.stringify(schemaData);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [tenant]);
};
