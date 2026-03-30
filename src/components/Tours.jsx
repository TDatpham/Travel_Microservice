import React from 'react';

const toursData = [
  {
    id: 1,
    title: 'East Village Ice Cream Crawl',
    desc: "We will stop at five different world-class ice cream shops on this 1.5 mile 1.5 hour tour. At each ice cream store we'll explore the story behind the business and see what makes the ice cream unique as you savor every…",
    img: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80',
    date: 'Today',
    author: 'Avenger Initiative',
    comments: 2,
  },
  {
    id: 2,
    title: 'Brooklyn Bridge cinematic photo walk',
    desc: 'This experience takes place at the Brooklyn Bridge Park and Brooklyn Bridge, but I’m always open to capture clients at different locations upon request for an additional charge. ',
    img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80',
    date: 'Today',
    author: 'Ager Pagla',
    comments: 12,
  },
];

const Tours = () => {
  return (
    <section id="tours">
      <div className="container">
        <div className="title-container">
          <h2 className="section-title">Travel Tips and Advice</h2>
          <div className="section-button hotel-button">
            view all <img src="/Imgs/icons/bleft.png" alt="" />
          </div>
        </div>
        <div className="tours-cards">
          {toursData.map((tour) => (
            <div className="tours-card" key={tour.id}>
              <div className="tour-img">
                <img src={tour.img} alt={tour.title} width="320" height="380" />
              </div>
              <div className="tours-card-content">
                <div className="tours-card-contents-text">
                  <h3>{tour.title}</h3>
                  <p>{tour.desc}</p>
                </div>
                <div className="tours-card-content-icons">
                  <h6>
                    <img src="/Imgs/icons/calendersml.png" alt="" /> {tour.date}
                  </h6>
                  <h6>
                    <img src="/Imgs/icons/user.png" alt="" /> {tour.author}
                  </h6>
                  <h6>
                    <img src="/Imgs/icons/message.png" alt="" /> {tour.comments}
                  </h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tours;
