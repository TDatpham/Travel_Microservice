import React from 'react';

const About = () => {
  return (
    <section id="About">
      <div className="about-content">
        <h2>About US</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a sapien justo. Nulla facilisis tristique imperdiet. Nullam a placerat odio. Sed in ex augue. Aliquam porta consectetur lorem sit amet ultrices. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
        </p>

        <div className="section-button hotel-button">
          Read More <img src="/Imgs/icons/bleft.png" alt="" />
        </div>
      </div>

      <div className="about-img">
        <img src="/Imgs/about img.png" alt="" width="556" height="488" />
      </div>
    </section>
  );
};

export default About;
