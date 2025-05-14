import React from "react";
import "./testimonials.css";

const Testimonials = () => {
  const testimonialsData = [
    {
      id: 1,
      name: "Akash Khot",
      position: "Student",
      message:
        "This platform helped me learn so effectively. The courses are amazing and the instructors are very good.",
      image:
        "https://saisj2002.github.io/Images/Akash.jpg",
    },
    {
      id: 2,
      name: "Digvijay Patil",
      position: "Student",
      message:
        "I've learned more here than in any other place. The interactive lessons make learning enjoyable.",
      image:
        "https://saisj2002.github.io/Images/Digvijay.jpg",
    },
    {
      id: 3,
      name: "Sameer Dagale",
      position: "Student",
      message:
        "This platform helped me learn so effectively. The courses are amazing and the instructors are top-notch.",
      image:
        "https://saisj2002.github.io/Images/Sameer.jpg",
    },
    {
      id: 4,
      name: "Aditya Dayma",
      position: "Student",
      message:
        "I've learned more here than in any other place. The interactive lessons make learning enjoyable.",
      image:
        "https://saisj2002.github.io/Images/Aditya.jpg",
    },
  ];
  return (
    <section className="testimonials">
      <h2>What our students say</h2>
      <div className="testmonials-cards">
        {testimonialsData.map((e) => (
          <div className="testimonial-card" key={e.id}>
            <div className="student-image">
              <img src={e.image} alt="" />
            </div>
            <p className="message">{e.message}</p>
            <div className="info">
              <p className="name">{e.name}</p>
              <p className="position">{e.position}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
