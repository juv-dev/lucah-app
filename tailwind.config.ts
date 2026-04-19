import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        navy:   '#1B2A6B',
        purple: '#5C3D9E',
        lavend: '#EAE6F8',
        teal:   '#006064',
        gold:   '#F59E0B',
      },
    },
  },
  plugins: [],
} satisfies Config;
