import { ClerkProvider } from "@clerk/nextjs";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "DataSense AI",
  description: "Upload a CSV and chat with your data using AI",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={geist.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}