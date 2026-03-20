import "./globals.css";
import type { ReactNode } from "react";
import PWAInstallHandler from "./components/PWAInstallHandler";
import PushNotificationPrompt from "./components/PushNotificationPrompt";

export const metadata = {
  title: "GALENDER",
  description: "우리만의 GA 캘린더",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json?v=2" />
        <link rel="icon" href="/galenderciapp.png?v=2" />
        <link rel="apple-touch-icon" href="/galenderciapp.png?v=2" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GALENDER" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background-light text-slate-900 antialiased font-sans">
        <PWAInstallHandler />
        <PushNotificationPrompt />
        {children}
      </body>
    </html>
  );
}
