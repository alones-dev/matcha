import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matcha",
  description: "Trouvez l'amour qui vous correspond ! Rejoignez des milliers de célibataires à la recherche de leur âme soeur sur Matcha.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
