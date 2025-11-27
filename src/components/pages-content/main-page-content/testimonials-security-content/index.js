import React, { useState, useEffect } from "react";
import TestimonialsContent from "./testimonials-content";
import SecurityContent from "./security-content";

const TestimonialsSecurityContent = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.matchMedia("(max-width: 900px)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="testimonials-security-content">
      {isMobile ? (
        <>
          <SecurityContent />
          <TestimonialsContent />
        </>
      ) : (
        <>
          <TestimonialsContent />
          <SecurityContent />
        </>
      )}
    </section>
  );
};

export default TestimonialsSecurityContent;
