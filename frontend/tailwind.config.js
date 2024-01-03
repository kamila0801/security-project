module.exports = {
  important: true,
  content: [
    "./src/**/*.{html,ts}",
  ],
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        xxs: '0.7rem'
      },
      gridTemplateColumns: {
        'cards': 'repeat(auto-fill, minmax(250px, 1fr))',
        'filters': 'repeat(auto-fill, minmax(200px, 1fr))'
      },
      backgroundImage: {
        'top-part-colored-light': 'linear-gradient(to bottom, #5138EC 50%, #000000 50%)',
        'bottom-part-colored-light': 'linear-gradient(to bottom, #000000 50%, #5138EC 50%)',
      },
      transitionProperty: {
        'rotate': 'transform',
        'width': 'width'
      },
      left: {
        'sidebar': '170px'
      },
      width: {
        '10px': '10px',
        '50px': '50px',
        'sidebar': '170px',
        'topbar': 'calc(100vw - 170px)',
        'field-xs': '130px',
        'field-small': '274px',
        'field-medium': '300px',
        'field-large': '560px',
        'field-searchbar': '420px',
        'fit': 'fit-content',
        '300': '300px'
      },
      height: {
        '60vh': '60vh',
        '70vh': '70vh',
        'fit': 'fit-content'
      },
      maxHeight: {
        '1000': '1000px',
      },
      maxWidth: {
        '1000': '1000px',
      }
    },
    colors: {
      'neutral': {
        black: '#000000',
        white: '#FFFFFF'
      },
      'gray': {
        120: '#121212',  // Background for Dark-mode
        110: '#202020',  // Sidebar for Dark-mode
        100: '#21242C',
        90: '#383D48',
        80: '#4B5362',
        70: '#646E82',
        60: '#8690A2',
        50: '#9DA5B4',
        40: '#B7BECD',
        30: '#D9E3F0',
        25: 'rgba(0, 0, 0, 0.20)',
        20: '#EAEEF5',
        10: '#F3F5F9',
        5: '#F7F8FB',
      },
      'primary': {
        120: '#3521B5',
        100: '#5138EC',
        80: '#7460F0',
        60: '#9788F4',
        40: '#B9AFF7',
        20: '#DCD7FB',
      },
      'green': {
        100: '#44C395',
        80: '#69CFAA',
        60: '#8FDBBF',
        40: '#B4E7D5',
        20: '#DAF3EA',
      },
      'yellow': {
        100: '#FCD974',
        80: '#FDE190',
        60: '#FDE8AC',
        40: '#FEF0C7',
        20: '#FEF7E3',
      },
      'red': {
        100: '#FF6666',
        80: '#FF8585',
        60: '#FFA3A3',
        40: '#FFC2C2',
        20: '#FFE0E0',
      },
      'blue': {
        100: '#2F80ED',
        80: '#5999F1',
        60: '#82B3F4',
        40: '#ACCCF8',
        20: '#D5E6FB',
      },
      'misc': {
        facebook: '#2474E1'
      },
      transparent: 'transparent',
    },
    fontFamily: {
      rubik: ['Rubik', 'sans-serif']
    },
  },
  variants: {
    extend: {
      brightness: ['hover', 'focus'],
      ringWidth: ['hover', 'active'],
      ringColor: ['hover', 'active'],
    },
  },
  plugins: [],
}
