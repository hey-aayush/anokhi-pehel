const Spinner = () => {

  const spinnerStyle = {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const waveStyle = {
    width: '5px',
    height: '100px',
    background: 'linear-gradient(45deg, cyan, #000000)',
    margin: '10px',
    animation: 'wave 1s linear infinite',
    borderRadius: '20px',
  };

  const waveDelayStyles = Array.from(Array(10), (_, i) => ({
    animationDelay: `${(i + 1) * 0.1}s`
  }));

  const keyframes = {
    '0%': {
      transform: 'scale(0)',
    },
    '50%': {
      transform: 'scale(1)',
    },
    '100%': {
      transform: 'scale(0)',
    },
  };

  return (
    <div style={spinnerStyle}>
      {Array.from(Array(10), (_, i) => (
        <div key={i} style={{ ...waveStyle, ...waveDelayStyles[i] }} />
      ))}
      <style>
        {`
          @keyframes wave {
            ${Object.entries(keyframes).map(([key, value]) => `${key} { ${Object.entries(value).map(([prop, val]) => `${prop}: ${val};`).join(' ')} }`).join(' ')}
          }
        `}
      </style>
    </div>
  );
};

export default Spinner;
