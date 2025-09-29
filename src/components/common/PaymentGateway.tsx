'use client';

import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { createPaymentOrder, verifyPayment } from '../../store/slices/paymentSlice';

interface PaymentGatewayProps {
  bookingId: string;
  amount: number;
  doctorName: string;
  patientName: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  bookingId,
  amount,
  doctorName,
  patientName,
  onSuccess,
  onError
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      const paymentOrder = await dispatch(createPaymentOrder({ bookingId, amount })).unwrap();
      
      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'Healthcare Management System',
        description: `Consultation with ${doctorName}`,
        order_id: paymentOrder.razorpayOrderId,
        handler: async (response: any) => {
          try {
            await dispatch(verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            })).unwrap();
            
            onSuccess(response.razorpay_payment_id);
          } catch (error) {
            onError('Payment verification failed');
          }
        },
        prefill: {
          name: patientName,
          email: 'patient@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#3B82F6'
        }
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      onError('Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  const handleUPIPayment = () => {
    if (!upiId) {
      onError('Please enter UPI ID');
      return;
    }
    
    // Generate UPI payment link
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(patientName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Consultation with ${doctorName}`)}`;
    
    // Open UPI app
    window.location.href = upiLink;
    
    // For demo purposes, simulate success after 3 seconds
    setTimeout(() => {
      onSuccess('upi_' + Date.now());
    }, 3000);
  };

  const handlePayment = () => {
    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else if (paymentMethod === 'upi') {
      handleUPIPayment();
    }
  };

  return (
    <Card className="payment-gateway">
      <div className="text-center mb-4">
        <h3>Complete Payment</h3>
        <div className="text-2xl font-bold text-primary mb-2">₹{amount}</div>
        <p className="text-600">Consultation with {doctorName}</p>
      </div>

      <Divider />

      {/* Payment Methods */}
      <div className="mb-4">
        <h4 className="mb-3">Select Payment Method</h4>
        
        <div className="flex flex-column gap-3">
          <div className="flex align-items-center">
            <RadioButton
              inputId="razorpay"
              name="payment"
              value="razorpay"
              onChange={(e) => setPaymentMethod(e.value)}
              checked={paymentMethod === 'razorpay'}
            />
            <label htmlFor="razorpay" className="ml-2 flex align-items-center gap-2">
              <i className="pi pi-credit-card text-blue-500"></i>
              <span>Credit/Debit Card, Net Banking, Wallets</span>
            </label>
          </div>

          <div className="flex align-items-center">
            <RadioButton
              inputId="upi"
              name="payment"
              value="upi"
              onChange={(e) => setPaymentMethod(e.value)}
              checked={paymentMethod === 'upi'}
            />
            <label htmlFor="upi" className="ml-2 flex align-items-center gap-2">
              <i className="pi pi-mobile text-green-500"></i>
              <span>UPI Payment</span>
            </label>
          </div>
        </div>

        {/* UPI ID Input */}
        {paymentMethod === 'upi' && (
          <div className="mt-3">
            <label htmlFor="upiId" className="block mb-2">Enter UPI ID</label>
            <InputText
              id="upiId"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="example@paytm"
              className="w-full"
            />
          </div>
        )}
      </div>

      <Divider />

      {/* Payment Summary */}
      <div className="mb-4">
        <h4 className="mb-3">Payment Summary</h4>
        <div className="flex justify-content-between mb-2">
          <span>Consultation Fee</span>
          <span>₹{amount}</span>
        </div>
        <div className="flex justify-content-between mb-2">
          <span>Platform Fee</span>
          <span>₹0</span>
        </div>
        <div className="flex justify-content-between mb-2">
          <span>Taxes</span>
          <span>₹0</span>
        </div>
        <Divider />
        <div className="flex justify-content-between font-bold text-lg">
          <span>Total Amount</span>
          <span>₹{amount}</span>
        </div>
      </div>

      {/* Payment Button */}
      <Button
        label={`Pay ₹${amount}`}
        icon="pi pi-credit-card"
        className="w-full p-button-lg"
        onClick={handlePayment}
        loading={loading}
        disabled={paymentMethod === 'upi' && !upiId}
      />

      {/* Security Info */}
      <div className="mt-3 p-3 bg-green-50 border-green-200 border-round">
        <div className="flex align-items-center gap-2">
          <i className="pi pi-shield text-green-500"></i>
          <span className="text-green-700 text-sm">
            Your payment is secured with 256-bit SSL encryption
          </span>
        </div>
      </div>
    </Card>
  );
};

export default PaymentGateway;