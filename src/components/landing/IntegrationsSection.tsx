'use client';

export default function IntegrationsSection() {
  const integrationCategories = [
    {
      title: 'Payment Gateways',
      icon: '💳',
      iconBg: '#dbeafe',
      iconColor: '#2563eb',
      bgColor: '#f0f9ff',
      integrations: ['Razorpay', 'UPI Intent', 'PayU']
    },
    {
      title: 'Hospital Systems',
      icon: '🏥',
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
      bgColor: '#f0fdf4',
      integrations: ['HMS Integration', 'EHR Systems', 'Lab Management']
    },
    {
      title: 'Communication',
      icon: '💬',
      iconBg: '#f3e8ff',
      iconColor: '#9333ea',
      bgColor: '#faf5ff',
      integrations: ['SMS Gateway', 'Email Service', 'WhatsApp API']
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
            Seamless Integrations
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#1f2937',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Connect with your existing systems and popular healthcare tools
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {integrationCategories.map((category, index) => (
            <div key={index} style={{
              backgroundColor: category.bgColor,
              borderRadius: '20px',
              padding: '40px 30px',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: category.iconBg,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto'
              }}>
                <span style={{
                  fontSize: '28px'
                }}>
                  {category.icon}
                </span>
              </div>
              
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '24px'
              }}>
                {category.title}
              </h3>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {category.integrations.map((integration, idx) => (
                  <div key={idx} style={{
                    backgroundColor: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1f2937',
                    border: '1px solid rgba(0, 0, 0, 0.05)'
                  }}>
                    {integration}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}