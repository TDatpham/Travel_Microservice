import React from 'react';

const activitiesData = [
  { id: 1, title: 'Sailing', img: 'https://images.unsplash.com/photo-1513432800008-a900568fccfe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80' },
  { id: 2, title: 'Climbing', img: 'https://images.unsplash.com/photo-1489805549589-3c5ae55fe740?ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80' },
  { id: 3, title: 'Skiing', img: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?ixlib=rb-1.2.1&auto=format&fit=crop&w=627&q=80' },
  { id: 4, title: 'Hiking', img: 'https://images.unsplash.com/19/nomad.JPG?ixlib=rb-1.2.1&auto=format&fit=crop&w=1098&q=80' },
];

const Activities = () => {
  return (
    <section id="activities">
      <div className="container">
        <div className="title-container">
          <h2 className="section-title">Activities</h2>
          <div className="section-button hotel-button">
            view all <img src="/Imgs/icons/bleft.png" alt="" />
          </div>
        </div>

        <div className="activities-cards">
          {activitiesData.map((activity) => (
            <div className="activities-card" key={activity.id}>
              <img src={activity.img} alt={activity.title} width="320" height="380" />
              <h4>{activity.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Activities;
