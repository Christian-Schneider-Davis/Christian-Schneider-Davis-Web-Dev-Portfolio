export default function CameraConsent({ status, error, onAllow, compact }) {
  const label = status === 'idle' ? 'Turn on camera' : 'Try again';

  // Before the first click, draw the eye to the button: it's the way in.
  const attention = status === 'idle' ? 'consent--attention' : '';

  if (compact) {
    return (
      <div className={`consent consent--compact ${attention}`}>
        {error && (
          <p className="consent__error" role="alert">
            {error}
          </p>
        )}
        <button type="button" className="consent__pill" onClick={onAllow}>
          <span aria-hidden="true">✋</span> {label}
        </button>
      </div>
    );
  }

  return (
    <div className={`consent ${attention}`}>
      {status === 'idle' && (
        <p className="consent__badge">
          <span aria-hidden="true" /> Start here
        </p>
      )}
      <p className="consent__title">Try it with your hands</p>
      {error && (
        <p className="consent__error" role="alert">
          {error}
        </p>
      )}
      <button type="button" className="btn btn--small btn--light" onClick={onAllow}>
        {label}
      </button>
    </div>
  );
}
