/**
 * Common formatting and style concatenation utilities
 */

export function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Generate unique relative avatars or woodland icons for visitors
export function getWoodlandAvatar(name: string): string {
  const code = name.charCodeAt(0) + (name.charCodeAt(name.length - 1) || 0);
  const avatars = [
    'rabbit',
    'fox',
    'bear',
    'hedgehog'
  ];
  return avatars[code % avatars.length];
}
