"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const heroImages = [
  "/helsingborg.webp",
  "/hendelse1.jpg",
  "/hendelse2.jpg",
  "/hendelse3.jpg",
  "/hendelse4.jpg",
  "/hendelse5.jpg",
];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* HERO SLIDESHOW SECTION */}
      <section className="relative h-[70vh] overflow-hidden">
        {heroImages.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 scale-110 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
        <div className="absolute inset-0 bg-black/70 z-10" />
        <div className="relative z-20 flex flex-col justify-center items-center text-center h-full px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            DZcuts Professional Haircare
          </h1>
          <p className="text-lg sm:text-xl mb-6">Kunskap, service & kvalitet</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded font-semibold"
            >
              Boka
            </Link>
            <a
              href="#behandlingar"
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded font-semibold"
            >
              Se Behandlingar
            </a>
          </div>
        </div>
      </section>

      {/* INFO SECTION */}
      <section className="py-12" id="behandlingar">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Kunskap, service &amp; kvalitet
          </h2>
          <p className="text-gray-300 mb-4">
            Vår strävan är att med stor kunskap inom hår-, klipp- och
            färgtekniker, kunna ge dig som kund en upplevelse och frisyr som
            stämmer överens med dina önskemål och förutsättningar.
          </p>
          <p className="text-gray-300">
            Vi arbetar endast med utvalda produkter av högsta kvalitet från
            ledande varumärken.
          </p>
        </div>
      </section>

      {/* FRISÖRER SEKTION */}
      <section className="py-12 bg-gray-800">
        <div className="container mx-auto px-4">
          <h3 className="text-xl sm:text-2xl font-bold text-center mb-10">
            Våra Frisörer
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 relative rounded-full overflow-hidden mb-3 shadow-lg">
                <Image
                  src="/profilepic.png"
                  alt="Fadezbydrizz"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-white font-semibold text-lg">Fadezbydrizz</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 relative rounded-full overflow-hidden mb-3 shadow-lg">
                <Image
                  src="/blizzprofil.webp"
                  alt="Blizz Fadez"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-white font-semibold text-lg">Blizz Fadez</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        className="py-12 bg-cover bg-center bg-no-repeat text-white text-center"
        style={{ backgroundImage: `url('/cta-bg.jpg')` }}
      >
        <div className="bg-black/60 py-12 px-4">
          <h3 className="text-3xl font-bold mb-4">Boka din tid idag!</h3>
          <p className="mb-6 max-w-xl mx-auto text-gray-200">
            Kontakta oss för mer information eller boka direkt online.
          </p>
          <Link
            href="/booking"
            className="bg-white hover:bg-gray-200 text-black px-6 py-3 rounded font-semibold inline-block"
          >
            Boka nu
          </Link>
        </div>
      </section>

      {/* KONTAKTSEKTION */}
      <section className="py-12 bg-gray-800" id="kontakt">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Hör av dig</h3>
              <p className="mb-2">Besök oss:</p>
              <p className="text-gray-400">
                Kopparmöllegatan 22, Helsingborg
              </p>
              <p className="mt-4">Ring oss:</p>
              <p className="text-gray-400">0793-366245</p>
              <p className="mt-4">Maila oss:</p>
              <p className="text-gray-400">info@dzcuts.se</p>

              <Link
                href="/booking"
                className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold shadow"
              >
                Boka tid
              </Link>
            </div>

            <div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2277.4239483994374!2d12.694742315926525!3d56.04882028064371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46521e7a92b1c4f3%3A0x7e28d3f4bcdd8a1f!2sKopparm%C3%B6llegatan%2022%2C%20252%2025%20Helsingborg%2C%20Sweden!5e0!3m2!1sen!2sse!4v1710000000000!5m2!1sen!2se"
                width="100%"
                height="300"
                allowFullScreen
                loading="lazy"
                className="rounded-lg shadow-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 border-t border-gray-700 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2025 DZcuts. Alla rättigheter förbehållna.</p>
          <p>
            Adress: Kopparmöllegatan 22, Helsingborg | Tel: 0793-366245
          </p>
        </div>
      </footer>
    </div>
  );
}
