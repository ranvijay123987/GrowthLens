export function getStartupImageUrl(name: string, size = 128): string {
  const encoded = encodeURIComponent(name.replace(/\s+/g, "+"));
  return `https://ui-avatars.com/api/?name=${encoded}&background=10b981&color=fff&size=${size}&bold=true`;
}
