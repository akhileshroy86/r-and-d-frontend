'use client';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Patient',
      avatar: '👩',
      rating: 5,
      testimonial: 'Booked my appointment in minutes using voice input in Hindi. The real-time queue updates saved me hours of waiting. Amazing experience!',
      bgColor: '#f0f9ff'
    },
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Cardiologist',
      avatar: '👨⚕️',
      rating: 5,
      testimonial: 'The queue management is brilliant. No more crowding outside my office. Patients arrive exactly when needed. Smooth workflow!',
      bgColor: '#f0fdf4'
    },
    {
      name: 'Suresh Reddy',
      role: 'Hospital Administrator',
      avatar: '👨💼',
      rating: 5,
      testimonial: 'Revenue tracking and automated reports have transformed our operations. Payment reconciliation is now completely automated!',
      bgColor: '#fdf4ff'
    },
    {
      name: 'Sister Mary Joseph',
      role: 'Head Nurse',
      avatar: '👩⚕️',
      rating: 5,
      testimonial: 'Staff dashboard is so intuitive. Even our senior nurses adapted quickly. Managing walk-ins and appointments is now effortless.',
      bgColor: '#fefce8'
    },
    {
      name: 'Venkata Rao',
      role: 'Senior Patient',
      avatar: '👴',
      rating: 5,
      testimonial: 'Telugu language support made everything so easy. My grandson helped me book online, and I could track everything on my phone.',
      bgColor: '#f0fdf4'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#fbbf24' : '#e5e7eb', fontSize: '16px' }}>
        ⭐
      </span>
    ));
  };

  return (
    <div style={{
      padding: '80px 0',
      backgroundColor: 'white',
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '16px'
          }}>
            What Our Users Say
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#1f2937',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Real feedback from patients, doctors, and hospital administrators
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div key={index} style={{
              background: testimonial.bgColor,
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
              border: '1px solid #f1f5f9'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0,
                    marginBottom: '2px'
                  }}>
                    {testimonial.name}
                  </h4>
                  <p style={{
                    fontSize: '14px',
                    color: '#4b5563',
                    margin: 0
                  }}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                {renderStars(testimonial.rating)}
              </div>
              
              <p style={{
                fontSize: '14px',
                color: '#111827',
                lineHeight: '1.6',
                fontStyle: 'italic',
                margin: 0
              }}>
                "{testimonial.testimonial}"
              </p>
            </div>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {testimonials.slice(3).map((testimonial, index) => (
            <div key={index + 3} style={{
              background: testimonial.bgColor,
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
              border: '1px solid #f1f5f9'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0,
                    marginBottom: '2px'
                  }}>
                    {testimonial.name}
                  </h4>
                  <p style={{
                    fontSize: '14px',
                    color: '#4b5563',
                    margin: 0
                  }}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                {renderStars(testimonial.rating)}
              </div>
              
              <p style={{
                fontSize: '14px',
                color: '#111827',
                lineHeight: '1.6',
                fontStyle: 'italic',
                margin: 0
              }}>
                "{testimonial.testimonial}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}