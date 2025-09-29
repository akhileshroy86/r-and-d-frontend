'use client';

import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchNearbyHospitals } from '../../store/slices/hospitalSlice';
import { Hospital, Doctor } from '../../types/models';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { nearbyHospitals, loading } = useSelector((state: RootState) => state.hospital);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const searchTypes = [
    { label: 'All', value: 'all' },
    { label: 'Hospitals', value: 'hospitals' },
    { label: 'Doctors', value: 'doctors' },
    { label: 'Symptoms', value: 'symptoms' }
  ];

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setLocation(coords);
          dispatch(fetchNearbyHospitals(coords));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [dispatch]);

  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching for:', searchQuery, 'Type:', searchType);
  };

  const HospitalCard = ({ hospital }: { hospital: Hospital }) => (
    <Card className="mb-3">
      <div className="flex justify-content-between align-items-start">
        <div className="flex-1">
          <h3 className="mt-0 mb-2">{hospital.name}</h3>
          <p className="text-600 mb-2">{hospital.address}</p>
          <div className="flex align-items-center mb-2">
            <Rating value={hospital.rating} readOnly cancel={false} className="mr-2" />
            <span className="text-sm text-600">({hospital.rating})</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {hospital.departments.slice(0, 3).map((dept) => (
              <span key={dept.id} className="bg-blue-100 text-blue-800 px-2 py-1 border-round text-sm">
                {dept.name}
              </span>
            ))}
          </div>
          <div className="flex align-items-center">
            <i className={`pi ${hospital.status === 'open' ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'} mr-2`}></i>
            <span className={hospital.status === 'open' ? 'text-green-600' : 'text-red-600'}>
              {hospital.status === 'open' ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>
        <div className="flex flex-column gap-2">
          <Button label="Book Appointment" className="p-button-sm" />
          <Button label="View Details" className="p-button-outlined p-button-sm" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-4">
      {/* Search Section */}
      <Card className="mb-4">
        <div className="flex flex-column gap-3">
          <h2 className="mt-0">Find Healthcare Services</h2>
          <div className="flex gap-2">
            <div className="flex-1">
              <InputText
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hospitals, doctors, or symptoms..."
                className="w-full"
              />
            </div>
            <Dropdown
              value={searchType}
              options={searchTypes}
              onChange={(e) => setSearchType(e.value)}
              className="w-auto"
            />
            <Button label="Search" icon="pi pi-search" onClick={handleSearch} />
          </div>
        </div>
      </Card>

      {/* Voice Recording Section */}
      <Card className="mb-4">
        <div className="text-center">
          <h3>Describe Your Symptoms</h3>
          <p className="text-600 mb-3">Record your symptoms and get AI-powered department suggestions</p>
          <Button
            label="Start Recording"
            icon="pi pi-microphone"
            className="p-button-lg p-button-rounded"
            severity="help"
          />
        </div>
      </Card>

      {/* Nearby Hospitals */}
      <div className="mb-4">
        <h2>Nearby Hospitals</h2>
        {loading ? (
          <div className="text-center p-4">
            <i className="pi pi-spinner pi-spin text-2xl"></i>
            <p>Loading nearby hospitals...</p>
          </div>
        ) : (
          <div className="grid">
            {nearbyHospitals.map((hospital) => (
              <div key={hospital.id} className="col-12 md:col-6 lg:col-4">
                <HospitalCard hospital={hospital} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid">
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="text-center">
            <i className="pi pi-calendar text-4xl text-blue-500 mb-3"></i>
            <h4>My Appointments</h4>
            <p className="text-600">View and manage your appointments</p>
            <Button label="View All" className="p-button-text" />
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="text-center">
            <i className="pi pi-user-plus text-4xl text-green-500 mb-3"></i>
            <h4>Find Doctors</h4>
            <p className="text-600">Search for specialists</p>
            <Button label="Search" className="p-button-text" />
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="text-center">
            <i className="pi pi-file-medical text-4xl text-orange-500 mb-3"></i>
            <h4>Medical History</h4>
            <p className="text-600">Access your records</p>
            <Button label="View" className="p-button-text" />
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="text-center">
            <i className="pi pi-star text-4xl text-yellow-500 mb-3"></i>
            <h4>Reviews</h4>
            <p className="text-600">Rate your experience</p>
            <Button label="Write Review" className="p-button-text" />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;