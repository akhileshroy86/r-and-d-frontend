'use client';

const HowItWorksSection = () => {
  const features = [
    {
      emoji: '⚡',
      bgColor: 'rgb(224, 231, 255)',
      iconColor: 'rgb(99, 102, 241)',
      title: 'RESTful APIs',
      description: 'Modern REST endpoints with OpenAPI 3.0 specification for seamless third-party integrations'
    },
    {
      emoji: '🔄',
      bgColor: 'rgb(220, 252, 231)',
      iconColor: 'rgb(22, 163, 74)',
      title: 'Real-time Sync',
      description: 'WebSocket connections and event-driven architecture for instant data synchronization across all systems'
    },
    {
      emoji: '📋',
      bgColor: 'rgb(219, 234, 254)',
      iconColor: 'rgb(59, 130, 246)',
      title: 'JSON Schema',
      description: 'Standardized JSON data formats with comprehensive schema validation for reliable data exchange'
    },
    {
      emoji: '📋',
      bgColor: 'rgb(243, 232, 255)',
      iconColor: 'rgb(139, 92, 246)',
      title: 'API Documentation',
      description: 'Interactive Swagger UI documentation with code examples and sandbox environment for testing'
    }
  ];

  return (
    <section style={{ padding: '60px 20px', backgroundColor: '#f8fafc' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0px auto' }}>
        {features.map((feature, index) => (
          <div key={index} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '40px 30px', textAlign: 'center', boxShadow: 'rgba(0, 0, 0, 0.08) 0px 4px 20px', border: '1px solid rgb(226, 232, 240)', transition: '0.3s' }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: feature.bgColor, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0px auto 25px' }}>
              <span style={{ fontSize: '32px', color: feature.iconColor }}>{feature.emoji}</span>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'rgb(30, 41, 59)', marginBottom: '15px' }}>{feature.title}</h3>
            <p style={{ fontSize: '14px', color: 'rgb(100, 116, 139)', lineHeight: '1.6' }}>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;