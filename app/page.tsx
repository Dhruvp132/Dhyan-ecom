import Hero from "./components/Hero";
import HomeProductsWrapper from "./components/HomeProductsWrapper";
import Footer from "./components/Footer";

export const metadata = {
  title: "COLT & CO. - Elevate Your Shopping Experience",
  description: "Discover the best products at the best prices with COLT & CO.. Your ultimate shopping destination.",
  openGraph: {
    title: "COLT & CO. - Elevate Your Shopping Experience",
    description: "Discover the best products at the best prices with COLT & CO..",
    type: "website",
  },
}

export default function Home() {
  return (
    <main className="relative pt-[180px] w-full overflow-x-hidden min-h-screen">
      <Hero />
      <HomeProductsWrapper />
      <div className="relative z-20 bg-gray-900 w-full">
        <Footer />
      </div>
    </main>
  );
}
