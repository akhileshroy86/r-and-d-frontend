'use client';

export default function ApiArchitectureSection() {
  const apiFeatures = [
    {
      icon: '</>', 
      title: 'RESTful APIs',
      bgColor: '#f0f9ff',
      iconBg: '#dbeafe',
      iconColor: '#2563eb'
    },
    {
      icon: '🔄',
      title: 'Real-time Sync',
      bgColor: '#f0fdf4',
      iconBg: '#dcfce7',
      iconColor: '#16a34a'
    },
    {
      icon: '📋',
      title: 'JSON Format',
      bgColor: '#f0f9ff',
      iconBg: '#dbeafe',
      iconColor: '#2563eb'
    },
    {
      icon: '📚',
      title: 'Full Documentation',
      bgColor: '#faf5ff',
      iconBg: '#f3e8ff',
      iconColor: '#9333ea'
    }
  ];

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
            color: '#1e293b',
            marginBottom: '16px'
          }}>
            API-First Architecture
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#1f2937',
            lineHeight: '1.6',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Built with modern RESTful APIs that allow seamless integration with any existing hospital management system
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px'
        }}>
          {apiFeatures.map((feature, index) => (
            <div key={index} style={{
              backgroundColor: feature.bgColor,
              borderRadius: '16px',
              padding: '30px 20px',
              textAlign: 'center',
              border: '1px solid #f1f5f9'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: feature.iconBg,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <span style={{
                  fontSize: '24px',
                  color: feature.iconColor,
                  fontWeight: 'bold'
                }}>
                  {feature.icon}
                </span>
              </div>
              
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#1e293b',
                margin: 0
              }}>
                {feature.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}