import React from "react";
import Hero from "../../components/home-ui/Hero";
import "./style.css";
import Collection from "../../components/home-ui/Collection";
import MainCategory from "../../components/home-ui/category/MainCategory";
import CustomersPurchased from "../../components/home-ui/CustomersPurchased";
import BrowseCategory from "../../components/home-ui/category/BrowseCategory";
import CustomerService from "../../components/home-ui/CustomerService";
import Trending from "../../components/home-ui/Trending";

const Home = () => {
  return (
    <div className="container my-5 m-auto">
      <Hero />
      <Collection />
      <BrowseCategory />
      <MainCategory />
      <Trending />
      <CustomersPurchased />
      <CustomerService />
    </div>
  );
};

export default Home;
