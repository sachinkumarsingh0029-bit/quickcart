import React, { useState } from "react";
import Hero from "../../components/seller-ui/Hero";
import About from "../../components/seller-ui/About";
import Features from "../../components/seller-ui/Features";
import Pricing from "../../components/seller-ui/Pricing";
import RegistrationSteps from "../../components/seller-ui/RegistrationSteps";
import ApplyForm from "../../components/seller-ui/ApplyForm";
import SellerFaq from "../../components/seller-ui/SellerFaq";
import Modal from "../../components/seller-ui/RegistrationModel";

function ApplyAsSeller() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <div>
      <Hero />
      <Modal isOpen={isOpen} openModal={openModal} closeModal={closeModal} />
      <About />
      <Features />
      <Pricing isOpen={isOpen} openModal={openModal} />
      <RegistrationSteps openModal={openModal} />
      <SellerFaq />
    </div>
  );
}

export default ApplyAsSeller;
