"use client";

import { useState } from "react";
import { ArrowRight, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Hero2 = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Gradient background */}
      <div className="flex flex-col items-end absolute -right-60 -top-10 blur-xl z-0">
        <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-purple-600 to-sky-600"></div>
        <div className="h-[10rem] rounded-full w-[90rem] z-1 bg-gradient-to-b blur-[6rem] from-pink-900 to-yellow-400"></div>
        <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-yellow-600 to-sky-500"></div>
      </div>
      <div className="absolute inset-0 z-0 bg-noise opacity-30"></div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto flex items-center justify-between px-4 py-4 mt-6">
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
              <span className="font-bold text-sm">S</span>
            </div>
            <span className="ml-2 text-xl font-bold text-white">Sermayem</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-6">
              <NavItem label="Özellikler" hasDropdown />
              <NavItem label="Fiyatlandırma" />
              <NavItem label="Blog" />
            </div>
            <div className="flex items-center space-x-3">
              <button className="h-10 rounded-full bg-white px-6 text-sm font-medium text-black hover:bg-white/90 transition-colors">
                Giriş Yap
              </button>
            </div>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Menüyü aç/kapat</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </nav>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 flex flex-col p-6 bg-black/95 md:hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
                    <span className="font-bold text-sm">S</span>
                  </div>
                  <span className="ml-2 text-xl font-bold text-white">Sermayem</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="mt-10 flex flex-col space-y-6">
                <MobileNavItem label="Özellikler" />
                <MobileNavItem label="Fiyatlandırma" />
                <MobileNavItem label="Blog" />
                <div className="pt-6 space-y-3">
                  <button className="w-full h-12 rounded-full border border-gray-700 text-white text-base font-medium">
                    Giriş Yap
                  </button>
                  <button className="w-full h-12 rounded-full bg-white text-black text-base font-medium hover:bg-white/90 transition-colors">
                    Ücretsiz Başla
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badge */}
        <div className="mx-auto mt-8 flex max-w-fit items-center justify-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
          <span className="text-sm font-medium text-white">Türkiye&apos;nin kişisel finans uygulaması</span>
          <ArrowRight className="h-4 w-4 text-white" />
        </div>

        {/* Hero */}
        <div className="container mx-auto mt-12 px-4 text-center">
          <h1 className="mx-auto max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white">
            Paranızı Akıllıca Yönetin
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-gray-300 px-4">
            Gelir, gider ve birikimlerinizi tek panelde takip edin. Finansal hedeflerinize ulaşın.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row px-4">
            <button className="w-full sm:w-auto h-12 rounded-full bg-white px-8 text-base font-medium text-black hover:bg-white/90 transition-colors">
              Ücretsiz Başla
            </button>
            <button className="w-full sm:w-auto h-12 rounded-full border border-gray-600 px-8 text-base font-medium text-white hover:bg-white/10 transition-colors">
              Nasıl Çalışır?
            </button>
          </div>

          <div className="relative mx-auto my-16 sm:my-20 w-full max-w-5xl px-4">
            <div className="absolute inset-0 rounded shadow-lg bg-white blur-[10rem] opacity-10" />
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80"
              alt="Sermayem Dashboard"
              className="relative w-full h-auto shadow-2xl rounded-xl sm:rounded-2xl border border-white/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function NavItem({ label, hasDropdown }: { label: string; hasDropdown?: boolean }) {
  return (
    <div className="flex items-center gap-1 text-sm text-gray-300 hover:text-white cursor-pointer transition-colors">
      <span>{label}</span>
      {hasDropdown && <ChevronDown className="h-3.5 w-3.5" />}
    </div>
  );
}

function MobileNavItem({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-800 pb-4 text-lg text-white">
      <span>{label}</span>
      <ArrowRight className="h-4 w-4 text-gray-400" />
    </div>
  );
}

export { Hero2 };
