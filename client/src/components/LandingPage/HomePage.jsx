import React from "react";
import AppBar from "./Navbar";
import Landingpage from "./Banner";
import Procedure from "./Procedure";
import Concept from "./Concept";
import Footer from "./Footer";
import Ourstory from "./Ourstory";

function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* Navigation */}
      <AppBar />
      
      {/* Hero Banner */}
      <Landingpage />
      
      {/* Main Content Sections */}
      <main className="space-y-20 md:space-y-32">
        <Procedure />
        <Ourstory />
        <Concept />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HomePage;