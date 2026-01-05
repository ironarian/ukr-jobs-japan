import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "UKRJobsJapan",
  description: "Connect Ukrainians in Japan with trusted employers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-900 antialiased">
        <Providers>
          {/* Background */}
          <div className="gentle-bg fixed inset-0 -z-10" />
          <style>{`
            .gentle-bg {
              background:
                radial-gradient(
                  900px 600px at 50% -15%,
                  rgba(255, 178, 200, 0.75),
                  transparent 68%
                ),
                radial-gradient(
                  1000px 700px at 22% 52%,
                  rgba(185, 210, 245, 0.72),
                  transparent 68%
                ),
                radial-gradient(
                  1000px 700px at 78% 72%,
                  rgba(255, 230, 170, 0.78),
                  transparent 68%
                ),
                linear-gradient(
                  180deg,
                  #ffffff 0%,
                  #f9fbff 42%,
                  #fff8eb 72%,
                  #ffffff 100%
                );
              background-repeat: no-repeat;
              background-size: 120% 120%;
              animation: gentleFloat 28s ease-in-out infinite;
            }

            @keyframes gentleFloat {
              0%, 100% {
                background-position:
                  50% 0%,
                  22% 52%,
                  78% 72%,
                  50% 50%;
              }
              50% {
                background-position:
                  50% 3%,
                  25% 49%,
                  75% 75%,
                  50% 50%;
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .gentle-bg { animation: none; }
            }
          `}</style>

          {/* App frame */}
          <div className="min-h-screen flex flex-col">
            <Header />

            {/* трохи менші відступи на мобілці, як було на десктопі */}
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-10 md:py-12">
              {children}
            </main>

            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}