/* ---------------------------------------------------------
   Everything this site stores or loads from other companies.
   Shown in the cookie banner under "See what's used", and on the
   privacy policy page. Keep this up to date if you add analytics,
   embeds, etc. (and gate them with hasConsent() — see consent.js).
--------------------------------------------------------- */
export const COOKIE_GROUPS = [
  {
    title: 'Always on',
    note: 'This site sets no cookies of its own and uses no analytics, ads or tracking pixels. Fonts are hosted on this site. It saves one small setting in your browser.',
    items: [
      {
        name: 'csd-cookie-consent',
        provider: 'christianschneiderdavis.com',
        purpose: 'Remembers whether you accepted or declined this notice, so it doesn’t ask again.',
        type: 'Local storage · essential',
        duration: 'Until you clear your browser data',
      },
    ],
  },
  {
    title: 'Only if you accept',
    note: 'Nothing here loads until you accept, or until you ask for that one item on the page. These services receive your IP address, like any website you visit.',
    items: [
      {
        name: 'Amazon product photos',
        provider: 'Amazon',
        purpose: 'Shows product photos on the links page.',
        type: 'Images · no cookies',
        duration: '—',
      },
      {
        name: 'Live project previews',
        provider: 'Each project’s own website',
        purpose: 'Opens a project’s live site inside this page. That site may set its own cookies, under its own policy.',
        type: 'Embedded website',
        duration: 'Set by that site',
      },
      {
        name: 'Hand-tracking demo',
        provider: 'jsDelivr, Google',
        purpose: 'Downloads Google’s open-source MediaPipe files that power the gesture demo. Your camera feed stays on your device and is never uploaded.',
        type: 'Scripts · no cookies',
        duration: '—',
      },
    ],
  },
  {
    title: 'When you click an Amazon link',
    note: 'Amazon sets its own cookies on amazon.com, including one that credits me with a small commission. That happens on Amazon’s site, under Amazon’s cookie policy.',
    items: [],
  },
]
