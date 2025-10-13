'use client';

export default function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small clinics',
      price: '₹500',
      period: '/mo',
      features: 'Up to 15 doctors',
      isPopular: false
    },
    {
      name: 'Pro',
      description: 'Ideal for growing hospitals',
      price: '₹600',
      period: '/mo',
      features: 'Up to 25 doctors + Analytics',
      isPopular: true
    },
    {
      name: 'Enterprise',
      description: 'For large hospital chains',
      price: '₹899',
      period: '/mo',
      features: 'Up to 50 doctors + Multi-branch',
      isPopular: false
    }
  ];

  return (
    <div style={{
      padding: '80px 0',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      width: '100%',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        textAlign: 'center'
      }}>
        {/* Header Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '25px',
          padding: '8px 16px',
          marginBottom: '30px'
        }}>
          <span style={{ fontSize: '16px' }}>💡</span>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>Plans starting from ₹500/month</span>
          <span style={{
            backgroundColor: '#fbbf24',
            color: '#1f2937',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            6-month billing
          </span>
        </div>

        {/* Title and Description */}
        <h2 style={{
          fontSize: '42px',
          fontWeight: 'bold',
          marginBottom: '20px',
          lineHeight: '1.2'
        }}>
          Simple, Transparent Pricing
        </h2>
        
        <p style={{
          fontSize: '18px',
          opacity: 0.9,
          lineHeight: '1.6',
          maxWidth: '600px',
          margin: '0 auto 60px auto'
        }}>
          Choose the perfect plan for your hospital size. Scale up or down anytime with our flexible pricing model.
        </p>

        {/* Pricing Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {plans.map((plan, index) => (
            <div key={index} style={{
              background: plan.isPopular ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '40px 30px',
              position: 'relative',
              border: plan.isPopular ? '2px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.background = plan.isPopular ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = plan.isPopular ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              {plan.isPopular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#fbbf24',
                  color: '#1f2937',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Most Popular
                </div>
              )}
              
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                {plan.name}
              </h3>
              
              <p style={{
                fontSize: '14px',
                opacity: 0.8,
                marginBottom: '30px'
              }}>
                {plan.description}
              </p>
              
              <div style={{
                marginBottom: '20px'
              }}>
                <span style={{
                  fontSize: '48px',
                  fontWeight: 'bold'
                }}>
                  {plan.price}
                </span>
                <span style={{
                  fontSize: '18px',
                  opacity: 0.8
                }}>
                  {plan.period}
                </span>
              </div>
              
              <p style={{
                fontSize: '14px',
                opacity: 0.9,
                marginBottom: '0'
              }}>
                {plan.features}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button style={{
          backgroundColor: 'white',
          color: '#667eea',
          border: 'none',
          borderRadius: '12px',
          padding: '16px 32px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s ease'
        }}>
          See Complete Pricing
        </button>
      </div>
    </div>
  );
}