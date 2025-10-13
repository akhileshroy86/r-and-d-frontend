'use client';

export default function EnterpriseSecuritySection() {
  const securityFeatures = [
    'Multi-factor authentication for all users',
    'Role-based access control and permissions',
    'Audit logs for all system activities',
    'Regular security audits and penetration testing',
    'Secure API endpoints with rate limiting'
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
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center'
        }}>
          {/* Left Content */}
          <div>
            <h2 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '30px',
              lineHeight: '1.2'
            }}>
              Enterprise-Grade Security
            </h2>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {securityFeatures.map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#dcfce7',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{
                      color: '#16a34a',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </span>
                  </div>
                  <span style={{
                    fontSize: '16px',
                    color: '#1f2937',
                    lineHeight: '1.5'
                  }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Illustration */}
          <div style={{
            borderRadius: '20px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src="/4a5c581ae5-454f0ffb3996432b230c.png" 
              alt="Enterprise Security Illustration" 
              style={{
                width: '100%',
                height: 'auto',
                maxWidth: '500px',
                borderRadius: '16px'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}