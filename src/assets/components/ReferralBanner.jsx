import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

const ReferralBanner = () => {
    const slides = [
    {
      emoji: "💰",
      title: "Cash up for grabs!",
      text: "Invite friends and earn up to ₦5,600 Bonus",
    },
    {
      emoji: "🔥",
      title: "Hot Deals Just for You!",
      text: "Deposit ₦600, Get ₦40 Off Instantly!",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // 5 seconds

    return () => clearInterval(interval); // Clean up
  }, [slides.length]);
  return (
    <Card className="mb-4 rounded-2" style={{ border: "0" }}>
      <Card.Body className="d-flex align-items-center gap-3">
        <div
          className="rounded-circle bg-light d-flex align-items-center justify-content-center"
          style={{ width: 40, height: 40 }}
        >
          <span className="fs-5">{slides[currentSlide].emoji}</span>
        </div>
        <div>
          <div className="fw-medium">{slides[currentSlide].title}</div>
          <div className="small text-muted">{slides[currentSlide].text}</div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReferralBanner;

