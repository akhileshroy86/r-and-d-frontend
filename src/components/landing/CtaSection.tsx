'use client';

export default function CtaSection() {
  const stats = [
    {
      value: '30-Day',
      label: 'Free Trial'
    },
    {
      value: '24/7',
      label: 'Support Available'
    },
    {
      value: '99.9%',
      label: 'Uptime Guarantee'
    }
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '80px 0',
      color: 'white',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <h2 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          marginBottom: '20px',
          lineHeight: '1.2'
        }}>
          Ready to Make Healthcare Easier?
        </h2>
        
        <p style={{
          fontSize: '20px',
          opacity: 0.9,
          marginBottom: '40px',
          maxWidth: '700px',
          margin: '0 auto 40px auto',
          lineHeight: '1.6'
        }}>
          Join hundreds of hospitals already using HealthcareMS to streamline their operations and provide better patient experiences.
        </p>
        
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginBottom: '60px',
          flexWrap: 'wrap'
        }}>
          <button style={{
            backgroundColor: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s ease'
          }}>
            <span style={{ fontSize: '20px' }}>🏥</span>
            Sign Up Your Hospital
          </button>
          
          <button style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: '2px solid white',
            borderRadius: '12px',
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}>
            <span style={{ fontSize: '20px' }}>📞</span>
            Talk to Sales
          </button>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '30px 20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '16px',
                opacity: 0.9
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}