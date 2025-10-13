import { Hospital } from '../../types/models';

const mockHospitals: Hospital[] = [
  {
    id: '1',
    name: 'Apollo Hospitals Hyderabad',
    rating: 4.8,
    departments: [
      { id: '1', name: 'Cardiology' },
      { id: '2', name: 'Neurology' },
      { id: '3', name: 'Orthopedics' }
    ],
    address: 'Jubilee Hills, Hyderabad',
    phone: '+91-40-23607777',
    isOpen: true
  },
  {
    id: '2',
    name: 'KIMS Hospitals',
    rating: 4.6,
    departments: [
      { id: '4', name: 'Oncology' },
      { id: '5', name: 'Gastroenterology' },
      { id: '6', name: 'Pediatrics' }
    ],
    address: 'Secunderabad, Hyderabad',
    phone: '+91-40-44885555',
    isOpen: true
  },
  {
    id: '3',
    name: 'Continental Hospitals',
    rating: 4.7,
    departments: [
      { id: '7', name: 'Nephrology' },
      { id: '8', name: 'Pulmonology' },
      { id: '9', name: 'Dermatology' }
    ],
    address: 'Gachibowli, Hyderabad',
    phone: '+91-40-67777777',
    isOpen: true
  },
  {
    id: '4',
    name: 'Yashoda Hospitals',
    rating: 4.5,
    departments: [
      { id: '10', name: 'Emergency Medicine' },
      { id: '11', name: 'General Surgery' },
      { id: '12', name: 'Psychiatry' }
    ],
    address: 'Malakpet, Hyderabad',
    phone: '+91-40-23554455',
    isOpen: true
  }
];

export const mockHospitalService = {
  getAllHospitals: async (): Promise<Hospital[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return mockHospitals;
  }
};