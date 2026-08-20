// A small, self-contained icon set so the project has zero icon-library
// dependency. Every icon shares stroke weight + cap style for a coherent
// Fluent-ish line system; `currentColor` lets CSS drive color.

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const PATHS = {
  user: (
    <>
      <circle cx="12" cy="8" r="3.4" {...base} />
      <path d="M4.5 20c1.4-3.6 4.3-5.4 7.5-5.4s6.1 1.8 7.5 5.4" {...base} />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" {...base} />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.4" {...base} />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.4" {...base} />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.4" {...base} />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" {...base} />
      <path d="M4 7l8 6 8-6" {...base} />
    </>
  ),
  file: (
    <>
      <path d="M7 3.5h7l4 4v13a1 1 0 01-1 1H7a1 1 0 01-1-1v-16a1 1 0 011-1z" {...base} />
      <path d="M14 3.5v4h4" {...base} />
      <path d="M9 13h6M9 16.5h6" {...base} />
    </>
  ),
  folder: (
    <path d="M3.5 6.5a1 1 0 011-1h4.6l1.6 2h8.3a1 1 0 011 1v9.5a1 1 0 01-1 1h-14.5a1 1 0 01-1-1v-11.5z" {...base} />
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" {...base} />
      <path
        d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.4 5.6l-1.4 1.4M7 17l-1.4 1.4M18.4 18.4L17 17M7 7L5.6 5.6"
        {...base}
      />
    </>
  ),
  moon: <path d="M20 14.2A8.5 8.5 0 1110.3 4a6.7 6.7 0 009.7 10.2z" {...base} />,
  image: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" {...base} />
      <circle cx="8.5" cy="9.5" r="1.6" {...base} />
      <path d="M4 17l5.5-5.5a1.5 1.5 0 012.1 0L15 15" {...base} />
      <path d="M13.5 13.5L15.7 11.3a1.5 1.5 0 012.1 0L21 14.3" {...base} />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" {...base} />
      <path d="M19 19l-4-4" {...base} />
    </>
  ),
  minimize: <path d="M5 12h14" {...base} />,
  maximize: <rect x="5.5" y="5.5" width="13" height="13" rx="1.4" {...base} />,
  restore: (
    <>
      <rect x="7.5" y="7.5" width="11" height="11" rx="1.2" {...base} />
      <path d="M5.5 14.5v-8a1 1 0 011-1h8" {...base} />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" {...base} />,
  windows: (
    <>
      <rect x="3.5" y="3.5" width="7.2" height="7.2" rx="1" fill="currentColor" stroke="none" opacity="0.95" />
      <rect x="13.3" y="3.5" width="7.2" height="7.2" rx="1" fill="currentColor" stroke="none" opacity="0.75" />
      <rect x="3.5" y="13.3" width="7.2" height="7.2" rx="1" fill="currentColor" stroke="none" opacity="0.75" />
      <rect x="13.3" y="13.3" width="7.2" height="7.2" rx="1" fill="currentColor" stroke="none" opacity="0.55" />
    </>
  ),
  external: (
    <>
      <path d="M9 6H5.5a1 1 0 00-1 1v11.5a1 1 0 001 1H17a1 1 0 001-1V15" {...base} />
      <path d="M13 4h7v7M20 4l-9 9" {...base} />
    </>
  ),
  download: (
    <>
      <path d="M12 3.5v11.5M8 11l4 4 4-4" {...base} />
      <path d="M4.5 17v2.5a1 1 0 001 1h13a1 1 0 001-1V17" {...base} />
    </>
  ),
  back: <path d="M15 5l-7 7 7 7" {...base} />,
  github: (
    <path
      d="M12 2.5a9.5 9.5 0 00-3 18.5c.5.1.6-.2.6-.5v-1.7c-2.6.6-3.2-1.2-3.2-1.2-.4-1.1-1-1.4-1-1.4-.9-.6.1-.6.1-.6.9.1 1.4 1 1.4 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2-.2-4.2-1-4.2-4.6 0-1 .3-1.8.9-2.5-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.6 1a9 9 0 014.7 0c1.8-1.2 2.6-1 2.6-1 .5 1.3.2 2.3.1 2.6.6.7.9 1.5.9 2.5 0 3.6-2.2 4.4-4.3 4.6.3.3.6.9.6 1.8v2.6c0 .3.1.6.6.5A9.5 9.5 0 0012 2.5z"
      fill="currentColor"
      stroke="none"
    />
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" {...base} fill="none" />
      <path d="M7.5 10v6.5M7.5 7.6v.1M12 16.5V13a2 2 0 014 0v3.5M12 10v6.5" {...base} />
    </>
  ),
  send: <path d="M4 12l16-7-6 16-2.5-6.5L4 12z" {...base} />,
  play: <path d="M7 4.5v15l13-7.5-13-7.5z" fill="currentColor" stroke="none" />,
  pause: (
    <>
      <rect x="6.5" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none" />
      <rect x="13.5" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  skip: (
    <>
      <path d="M6 5v14l10-7z" fill="currentColor" stroke="none" />
      <rect x="17" y="5" width="2.4" height="14" rx="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  music: (
    <>
      <circle cx="7.5" cy="17.5" r="2.6" {...base} />
      <circle cx="17" cy="15.5" r="2.6" {...base} />
      <path d="M10.1 17.5V6.3L19.6 4v11.5" {...base} />
    </>
  ),
  chevronRight: <path d="M9 5l7 7-7 7" {...base} />,
  sparkle: (
    <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z" {...base} />
  ),
}

export function Icon({ name, size = 20, className, ...rest }) {
  const path = PATHS[name]
  if (!path) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {path}
    </svg>
  )
}
