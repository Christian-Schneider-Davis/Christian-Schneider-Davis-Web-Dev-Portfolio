/* ---------------------------------------------------------
   Everything this site stores or loads from other companies.
   Shown in the cookie banner under "See what's used".
   Keep this up to date if you add analytics, embeds, etc.
--------------------------------------------------------- */
export const COOKIE_GROUPS = [
  {
    title: 'Stored on your device',
    note: 'This site sets no cookies of its own. It saves one small setting in your browser.',
    items: [
      {
        name: 'csd-cookie-consent',
        provider: 'christianschneiderdavis.com',
        purpose: 'Remembers whether you accepted or declined this notice, so it doesn’t show again.',
        type: 'Local storage · essential',
        duration: 'Until you clear your browser data',
      },
    ],
  },
  {
    title: 'Loaded from other services',
    note: 'These services deliver files to your browser. They don’t set cookies here, but like any website they receive your IP address.',
    items: [
      {
        name: 'Google Fonts',
        provider: 'Google',
        purpose: 'Delivers the typefaces used on every page.',
        type: 'Fonts · no cookies',
        duration: '—',
      },
      {
        name: 'Amazon product images',
        provider: 'Amazon',
        purpose: 'Shows product photos on the links page.',
        type: 'Images · no cookies',
        duration: '—',
      },
      {
        name: 'MediaPipe (jsDelivr & Google Cloud)',
        provider: 'jsDelivr, Google',
        purpose: 'Loads the hand-tracking model for the gesture demo. Your camera feed stays on your device and is never uploaded.',
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
