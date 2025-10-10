'use client';

export default function SecuritySection() {
  const securityFeatures = [
    {
      icon: '🛡️',
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
      title: 'HIPAA Compliant',
      description: 'Full compliance with healthcare data protection standards'
    },
    {
      icon: '🔒',
      iconBg: '#dbeafe',
      iconColor: '#2563eb',
      title: '256-bit SSL',
      description: 'Bank-grade encryption for all data transmission'
    },
    {
      icon: '💾',
      iconBg: '#f3e8ff',
      iconColor: '#9333ea',
      title: 'Data Backup',
      description: 'Automated daily backups with 99.9% uptime guarantee'
    },
    {
      icon: '👥',
      iconBg: '#fee2e2',
      iconColor: '#dc2626',
      title: 'Privacy First',
      description: 'Complete patient data privacy and secure access controls'
    }
  ];

  return (
    <div style={{
      padding: '80px 0',
      backgroundColor: '#f8fafc',
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
            Security & Compliance
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#1f2937',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Your data security and patient privacy are our top priorities
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px'
        }}>
          {securityFeatures.map((feature, index) => (
            <div key={index} style={{
              textAlign: 'center',
              padding: '20px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: feature.iconBg,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto'
              }}>
                <span style={{
                  fontSize: '32px'
                }}>
                  {feature.icon}
                </span>
              </div>
              
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '12px'
              }}>
                {feature.title}
              </h3>
              
              <p style={{
                fontSize: '14px',
                color: '#1f2937',
                lineHeight: '1.6',
                margin: 0
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}