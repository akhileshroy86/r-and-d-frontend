'use client';

import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Steps } from 'primereact/steps';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { createBooking } from '../../store/slices/bookingSlice';
import { createPaymentOrder } from '../../store/slices/paymentSlice';
import { Doctor, Hospital, Department } from '../../types/models';

interface BookingFlowProps {
  selectedHospital?: Hospital;
  selectedDoctor?: Doctor;
  selectedDepartment?: Department;
}

const BookingFlow: React.FC<BookingFlowProps> = ({
  selectedHospital,
  selectedDoctor,
  selectedDepartment
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading: bookingLoading } = useSelector((state: RootState) => state.booking);
  const { loading: paymentLoading } = useSelector((state: RootState) => state.payment);

  const [activeIndex, setActiveIndex] = useState(0);
  const [bookingData, setBookingData] = useState({
    hospitalId: selectedHospital?.id || '',
    departmentId: selectedDepartment?.id || '',
    doctorId: selectedDoctor?.id || '',
    date: null as Date | null,
    timeRange: { start: '', end: '' },
    symptoms: '',
    paymentMethod: 'online'
  });

  const steps = [
    { label: 'Symptoms' },
    { label: 'Department' },
    { label: 'Doctor' },
    { label: 'Schedule' },
    { label: 'Payment' }
  ];

  const timeSlots = [
    { label: '9:00 AM - 10:00 AM', value: { start: '09:00', end: '10:00' } },
    { label: '10:00 AM - 11:00 AM', value: { start: '10:00', end: '11:00' } },
    { label: '11:00 AM - 12:00 PM', value: { start: '11:00', end: '12:00' } },
    { label: '2:00 PM - 3:00 PM', value: { start: '14:00', end: '15:00' } },
    { label: '3:00 PM - 4:00 PM', value: { start: '15:00', end: '16:00' } },
    { label: '4:00 PM - 5:00 PM', value: { start: '16:00', end: '17:00' } }
  ];

  const handleNext = () => {
    if (activeIndex < steps.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleBooking = async () => {
    if (!user || !bookingData.date) return;

    try {
      const booking = await dispatch(createBooking({
        patientId: user.id,
        hospitalId: bookingData.hospitalId,
        doctorId: bookingData.doctorId,
        date: bookingData.date.toISOString().split('T')[0],
        timeRange: bookingData.timeRange,
        symptoms: bookingData.symptoms,
        isWalkIn: false
      })).unwrap();

      if (bookingData.paymentMethod === 'online') {
        await dispatch(createPaymentOrder({
          bookingId: booking.id,
          amount: selectedDoctor?.consultationFee || 500
        }));
      }

      // Redirect to payment or confirmation
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  const renderStepContent = () => {
    switch (activeIndex) {
      case 0: // Symptoms
        return (
          <div className="p-4">
            <h3>Describe Your Symptoms</h3>
            <InputTextarea
              value={bookingData.symptoms}
              onChange={(e) => setBookingData({ ...bookingData, symptoms: e.target.value })}
              rows={5}
              cols={30}
              placeholder="Please describe your symptoms in detail..."
              className="w-full"
            />
            <div className="mt-3">
              <Button
                label="Record Symptoms"
                icon="pi pi-microphone"
                className="p-button-outlined"
              />
            </div>
          </div>
        );

      case 1: // Department
        return (
          <div className="p-4">
            <h3>Select Department</h3>
            {selectedDepartment ? (
              <Card>
                <h4>{selectedDepartment.name}</h4>
                <p>{selectedDepartment.description}</p>
              </Card>
            ) : (
              <div className="grid">
                {/* Department selection cards */}
                <div className="col-12 md:col-6">
                  <Card className="cursor-pointer hover:shadow-3">
                    <h4>Cardiology</h4>
                    <p>Heart and cardiovascular conditions</p>
                  </Card>
                </div>
                <div className="col-12 md:col-6">
                  <Card className="cursor-pointer hover:shadow-3">
                    <h4>Orthopedics</h4>
                    <p>Bone and joint conditions</p>
                  </Card>
                </div>
              </div>
            )}
          </div>
        );

      case 2: // Doctor
        return (
          <div className="p-4">
            <h3>Select Doctor</h3>
            {selectedDoctor ? (
              <Card>
                <div className="flex align-items-center">
                  <div className="flex-1">
                    <h4>{selectedDoctor.name}</h4>
                    <p>{selectedDoctor.qualification}</p>
                    <p>{selectedDoctor.specialization}</p>
                    <p>{selectedDoctor.experience} years experience</p>
                  </div>
                  <div className="text-right">
                    <h4>₹{selectedDoctor.consultationFee}</h4>
                    <p>Consultation Fee</p>
                  </div>
                </div>
              </Card>
            ) : (
              <div>
                {/* Doctor selection cards */}
                <Card className="mb-3 cursor-pointer hover:shadow-3">
                  <div className="flex justify-content-between align-items-center">
                    <div>
                      <h4>Dr. John Smith</h4>
                      <p>MBBS, MD Cardiology</p>
                      <p>15 years experience</p>
                    </div>
                    <div className="text-right">
                      <h4>₹800</h4>
                      <Button label="Select" className="p-button-sm" />
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        );

      case 3: // Schedule
        return (
          <div className="p-4">
            <h3>Select Date & Time</h3>
            <div className="grid">
              <div className="col-12 md:col-6">
                <label>Select Date</label>
                <Calendar
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.value as Date })}
                  minDate={new Date()}
                  className="w-full"
                />
              </div>
              <div className="col-12 md:col-6">
                <label>Select Time Slot</label>
                <Dropdown
                  value={bookingData.timeRange}
                  options={timeSlots}
                  onChange={(e) => setBookingData({ ...bookingData, timeRange: e.value })}
                  placeholder="Select time slot"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        );

      case 4: // Payment
        return (
          <div className="p-4">
            <h3>Payment Method</h3>
            <div className="flex flex-column gap-3">
              <div className="flex align-items-center">
                <RadioButton
                  inputId="online"
                  name="payment"
                  value="online"
                  onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.value })}
                  checked={bookingData.paymentMethod === 'online'}
                />
                <label htmlFor="online" className="ml-2">Online Payment (Razorpay/UPI)</label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="cash"
                  name="payment"
                  value="cash"
                  onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.value })}
                  checked={bookingData.paymentMethod === 'cash'}
                />
                <label htmlFor="cash" className="ml-2">Pay at Hospital</label>
              </div>
            </div>
            
            <Card className="mt-4">
              <h4>Booking Summary</h4>
              <div className="flex justify-content-between">
                <span>Doctor:</span>
                <span>{selectedDoctor?.name || 'Dr. John Smith'}</span>
              </div>
              <div className="flex justify-content-between">
                <span>Date:</span>
                <span>{bookingData.date?.toDateString()}</span>
              </div>
              <div className="flex justify-content-between">
                <span>Time:</span>
                <span>{bookingData.timeRange.start} - {bookingData.timeRange.end}</span>
              </div>
              <div className="flex justify-content-between font-bold">
                <span>Total:</span>
                <span>₹{selectedDoctor?.consultationFee || 800}</span>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <Card>
        <Steps model={steps} activeIndex={activeIndex} className="mb-4" />
        
        {renderStepContent()}
        
        <div className="flex justify-content-between mt-4">
          <Button
            label="Previous"
            icon="pi pi-chevron-left"
            className="p-button-outlined"
            onClick={handlePrevious}
            disabled={activeIndex === 0}
          />
          
          {activeIndex === steps.length - 1 ? (
            <Button
              label="Confirm Booking"
              icon="pi pi-check"
              onClick={handleBooking}
              loading={bookingLoading || paymentLoading}
            />
          ) : (
            <Button
              label="Next"
              icon="pi pi-chevron-right"
              iconPos="right"
              onClick={handleNext}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default BookingFlow;