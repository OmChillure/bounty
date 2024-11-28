import { Bree_Serif, Exo_2 } from 'next/font/google';

const breeSerif = Bree_Serif({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const exo2 = Exo_2({
    subsets: ['latin'],
    display: 'swap',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-exo2'
  });