import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['var(--font-montserrat)', 'system-ui'],
  			heading: ['var(--font-montserrat)', 'system-ui'],
  		},
  		letterSpacing: {
  			'tightest': '-0.03em',
  			'widest': '0.05em',
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		keyframes: {
  			appear: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '100%'
  				}
  			},
  			'sacred-rotate': {
  				'0%': { transform: 'rotate(0deg)' },
  				'100%': { transform: 'rotate(360deg)' },
  			},
  			'sacred-pulse': {
  				'0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
  				'50%': { opacity: '0.8', transform: 'scale(1.1)' },
  			},
  			'sacred-spiral': {
  				'0%': { transform: 'rotate(0deg) scale(1)' },
  				'50%': { transform: 'rotate(180deg) scale(1.2)' },
  				'100%': { transform: 'rotate(360deg) scale(1)' },
  			},
  			'pattern-fade': {
  				'0%, 100%': { opacity: '0.3' },
  				'50%': { opacity: '0.8' },
  			},
  			slideIn: {
  				'0%': { transform: 'translateY(10px)', opacity: '0' },
  				'100%': { transform: 'translateY(0)', opacity: '1' }
  			},
  			fadeIn: {
  				'0%': { opacity: '0' },
  				'100%': { opacity: '1' }
  			},
  			scaleIn: {
  				'0%': { transform: 'scale(0.95)', opacity: '0' },
  				'100%': { transform: 'scale(1)', opacity: '1' }
  			}
  		},
  		animation: {
  			appear: 'appear 300ms ease-out forwards',
  			'sacred-rotate': 'sacred-rotate 30s linear infinite',
  			'sacred-pulse': 'sacred-pulse 10s ease-in-out infinite',
  			'sacred-spiral': 'sacred-spiral 20s ease-in-out infinite',
  			'pattern-fade': 'pattern-fade 15s ease-in-out infinite',
  			'pattern-fade-delay-1': 'pattern-fade 15s ease-in-out infinite 5s',
  			'pattern-fade-delay-2': 'pattern-fade 15s ease-in-out infinite 10s',
  			'slideIn': 'slideIn 0.3s ease-out forwards',
  			'fadeIn': 'fadeIn 0.3s ease-out forwards',
  			'scaleIn': 'scaleIn 0.3s ease-out forwards'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
