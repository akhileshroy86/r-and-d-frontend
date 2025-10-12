'use client';

import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';

const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      id: 1,
      reviewer: 'R***',
      doctor: 'Dr. Rajesh Patel',
      time: '2 hours ago',
      rating: 5,
      comment: 'Excellent doctor with great expertise. Very patient and explains everything clearly. Highly recommended!',
      verified: true
    },
    {
      id: 2,
      reviewer: 'S***',
      hospital: 'Apollo Medical Center',
      time: '5 hours ago',
      rating: 4,
      comment: 'Clean facilities and professional staff. The queue management system works well. Good overall experience.',
      verified: true
    },
    {
      id: 3,
      reviewer: 'A***',
      doctor: 'Dr. Priya Kumar',
      time: '1 day ago',
      rating: 4.5,
      comment: 'Very knowledgeable neurologist. The appointment booking was smooth and the wait time was minimal.',
      verified: false
    }
  ];

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex align-items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <i key={i} className="pi pi-star-fill text-yellow-500 text-sm"></i>
        ))}
        {hasHalfStar && <i className="pi pi-star-half-fill text-yellow-500 text-sm"></i>}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={i} className="pi pi-star text-gray-300 text-sm"></i>
        ))}
      </div>
    );
  };

  const headerTemplate = () => (
    <div className="flex align-items-center justify-content-between" style={{ paddingTop: '12px', paddingLeft: '24px' }}>
      <h3 className="m-0 text-900 font-semibold">Reviews & Ratings</h3>
      <Button 
        icon="pi pi-external-link" 
        label="View All" 
        className="p-button-text p-button-sm" 
        size="small"
      />
    </div>
  );

  return (
    <Card header={headerTemplate} className="shadow-2 border-round-lg">
      {/* Rating Summary */}
      <div className="grid mb-4">
        <div className="col-6">
          <div className="bg-blue-50 p-4 border-round text-center">
            <div className="flex align-items-center justify-content-center gap-2 mb-2">
              {renderStars(4.8)}
              <span className="text-3xl font-bold text-blue-600 ml-2">4.8</span>
            </div>
            <div className="text-900 font-semibold mb-1">Doctor Ratings</div>
            <div className="text-600 text-sm mb-3">Based on 847 reviews</div>
            <Button 
              label="View all doctor reviews" 
              className="p-button-outlined p-button-sm w-full" 
              size="small"
            />
          </div>
        </div>
        <div className="col-6">
          <div className="bg-green-50 p-4 border-round text-center">
            <div className="flex align-items-center justify-content-center gap-2 mb-2">
              {renderStars(4.9)}
              <span className="text-3xl font-bold text-green-600 ml-2">4.9</span>
            </div>
            <div className="text-900 font-semibold mb-1">Hospital Ratings</div>
            <div className="text-600 text-sm mb-3">Based on 623 reviews</div>
            <Button 
              label="View all hospital reviews" 
              className="p-button-outlined p-button-sm w-full" 
              size="small"
            />
          </div>
        </div>
      </div>

      <Divider />

      {/* Latest Reviews */}
      <div>
        <div className="flex align-items-center justify-content-between mb-3">
          <h4 className="text-900 font-semibold m-0">Latest Reviews</h4>
          <Badge value="3 New" severity="info" />
        </div>
        
        <div className="flex flex-column gap-3">
          {reviews.map((review, index) => (
            <div key={review.id} className="border-1 surface-border p-4 border-round hover:shadow-2 transition-all transition-duration-200">
              <div className="flex align-items-start justify-content-between mb-3">
                <div className="flex align-items-center gap-3">
                  <div className="w-3rem h-3rem bg-primary-100 border-circle flex align-items-center justify-content-center">
                    <span className="text-primary font-bold">{review.reviewer}</span>
                  </div>
                  <div>
                    <div className="flex align-items-center gap-2 mb-1">
                      <span className="font-semibold text-900">
                        {review.doctor || review.hospital}
                      </span>
                      {review.verified && (
                        <Badge value="Verified" severity="success" className="text-xs" />
                      )}
                    </div>
                    <div className="text-sm text-600">{review.time}</div>
                  </div>
                </div>
                <div className="flex flex-column align-items-end gap-1">
                  {renderStars(review.rating)}
                  <span className="text-sm font-semibold">{review.rating}/5</span>
                </div>
              </div>
              
              <p className="text-700 line-height-3 mb-3 pl-5">
                "{review.comment}"
              </p>
              
              <div className="flex align-items-center justify-content-between pl-5">
                <div className="flex gap-2">
                  <Button 
                    label="See details" 
                    icon="pi pi-eye"
                    className="p-button-text p-button-sm" 
                    size="small"
                  />
                  <Button 
                    label="Respond" 
                    icon="pi pi-reply"
                    className="p-button-text p-button-sm" 
                    size="small"
                  />
                  <Button 
                    label="Report" 
                    icon="pi pi-flag"
                    className="p-button-text p-button-sm text-red-600" 
                    size="small"
                  />
                </div>
                <div className="flex align-items-center gap-2 text-600">
                  <i className="pi pi-thumbs-up text-sm cursor-pointer hover:text-primary"></i>
                  <span className="text-sm">12</span>
                  <i className="pi pi-thumbs-down text-sm cursor-pointer hover:text-primary ml-2"></i>
                  <span className="text-sm">1</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-4">
          <Button 
            label="Load More Reviews" 
            icon="pi pi-chevron-down"
            className="p-button-outlined" 
            size="small"
          />
        </div>
      </div>
    </Card>
  );
};

export default ReviewsSection;