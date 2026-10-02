import './globals.css';

export const metadata = {
  title: 'Videira Vinhoteca | Catálogo de Vinhos',
  description: 'Catálogo de vinhos da Videira Vinhoteca.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
