// Slugs que colidem com prefixos de rota reservados do frontend
// (/admin/*, /app/*, /styleguide) — nunca podem virar o slug público de um tenant.
export const RESERVED_SLUGS = ['admin', 'app', 'styleguide'];

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug.toLowerCase());
}
