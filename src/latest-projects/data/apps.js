// Central registry of every "app" in the OS. Desktop icons, the taskbar,
// and the Start menu all read from this single source of truth so nothing
// drifts out of sync.

export const APPS = [
  {
    id: 'about',
    title: 'About',
    icon: 'user',
    accent: 'var(--accent-blue)',
    defaultWidth: 860,
    defaultHeight: 640,
    pinned: true,
    desktop: true,
    order: 1,
  },
  {
    id: 'works',
    title: 'Recent Works',
    icon: 'grid',
    accent: 'var(--accent-violet)',
    defaultWidth: 980,
    defaultHeight: 680,
    pinned: true,
    desktop: true,
    order: 2,
  },
  {
    id: 'contact',
    title: 'Contact',
    icon: 'mail',
    accent: 'var(--accent-pink)',
    defaultWidth: 760,
    defaultHeight: 600,
    pinned: true,
    desktop: true,
    order: 3,
  },
  {
    id: 'resume',
    title: 'Résumé.pdf',
    icon: 'file',
    accent: 'var(--accent-teal)',
    defaultWidth: 780,
    defaultHeight: 640,
    pinned: false,
    desktop: true,
    order: 4,
  },
]

export const SOCIAL_LINKS = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/Christian-Schneider-Davis', icon: 'github' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/christian-schneider-davis/', icon: 'linkedin' },
  { id: 'mail', label: 'Email', href: 'mailto:schneiderdavis@aol.com', icon: 'mail' },
]

export function getApp(id) {
  return APPS.find((a) => a.id === id)
}
