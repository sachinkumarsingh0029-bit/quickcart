import React, { useState } from "react";
import ProductBanner from "../../components/landingPage-ui/ProductBanner";
import SellerBanner from "../../components/landingPage-ui/SellerBanner";
import Services from "../../components/landingPage-ui/Services";
import Faq from "../../components/landingPage-ui/Faq";
import Hero from "../../components/landingPage-ui/Hero";

function LandingPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Hero />
      <ProductBanner />
      <Services />
      <Faq />
      <SellerBanner />
    </>
  );
}
export default LandingPage;
