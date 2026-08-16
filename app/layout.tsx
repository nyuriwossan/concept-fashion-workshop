import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "コンセプトファッション工房",
  description: "感情・神話・民族衣装・美術様式から、映える衣装プロンプトを組み立てる工房。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

