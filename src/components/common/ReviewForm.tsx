'use client';

import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { InputTextarea } from 'primereact/inputTextarea';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { submitReview } from '../../store/slices/reviewSlice';

interface ReviewFormProps {
  bookingId: string;
  doctorId?: string;
  hospitalId?: string;
  doctorName?: string;
  hospitalName?: string;
  onSubmit: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  bookingId,
  doctorId,
  hospitalId,
  doctorName,
  hospitalName,
  onSubmit
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: '',
    isAnonymous: false,
    reviewType: doctorId ? 'doctor' : 'hospital'
  });
  const [loading, setLoading] = useState(false);

  const reviewTypes = [
    { label: 'Doctor Review', value: 'doctor' },
    { label: 'Hospital Review', value: 'hospital' },
    { label: 'Both', value: 'both' }
  ];

  const handleSubmit = async () => {
    if (reviewData.rating === 0) {
      return;
    }

    setLoading(true);
    try {
      await dispatch(submitReview({
        bookingId,
        doctorId: reviewData.reviewType === 'doctor' || reviewData.reviewType === 'both' ? doctorId : undefined,
        hospitalId: reviewData.reviewType === 'hospital' || reviewData.reviewType === 'both' ? hospitalId : undefined,
        rating: reviewData.rating,
        comment: reviewData.comment,
        isAnonymous: reviewData.isAnonymous
      })).unwrap();

      onSubmit();
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="review-form">
      <div className="text-center mb-4">
        <h3>Share Your Experience</h3>
        <p className="text-600">
          Help others by sharing your experience with {doctorName || hospitalName}
        </p>
      </div>

      {/* Review Type Selection */}
      {doctorId && hospitalId && (
        <div className="mb-4">
          <label className="block mb-2">Review Type</label>
          <Dropdown
            value={reviewData.reviewType}
            options={reviewTypes}
            onChange={(e) => setReviewData({ ...reviewData, reviewType: e.value })}
            className="w-full"
          />
        </div>
      )}

      {/* Rating */}
      <div className="mb-4 text-center">
        <label className="block mb-3 font-medium">Rate your experience</label>
        <Rating
          value={reviewData.rating}
          onChange={(e) => setReviewData({ ...reviewData, rating: e.value || 0 })}
          stars={5}
          className="text-2xl"
        />
        <div className="mt-2 text-sm text-600">
          {reviewData.rating === 0 && 'Please select a rating'}
          {reviewData.rating === 1 && 'Poor'}
          {reviewData.rating === 2 && 'Fair'}
          {reviewData.rating === 3 && 'Good'}
          {reviewData.rating === 4 && 'Very Good'}
          {reviewData.rating === 5 && 'Excellent'}
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label htmlFor="comment" className="block mb-2">
          Share your detailed experience (optional)
        </label>
        <InputTextarea
          id="comment"
          value={reviewData.comment}
          onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
          rows={4}
          placeholder="Tell us about your experience..."
          className="w-full"
        />
      </div>

      {/* Anonymous Option */}
      <div className="mb-4">
        <div className="flex align-items-center">
          <Checkbox
            inputId="anonymous"
            checked={reviewData.isAnonymous}
            onChange={(e) => setReviewData({ ...reviewData, isAnonymous: e.checked || false })}
          />
          <label htmlFor="anonymous" className="ml-2">
            Submit as anonymous review
          </label>
        </div>
        <small className="text-600 ml-4">
          Your name will be hidden and shown as "Verified Patient"
        </small>
      </div>

      {/* Review Guidelines */}
      <div className="mb-4 p-3 bg-blue-50 border-blue-200 border-round">
        <h5 className="mt-0 mb-2 text-blue-700">Review Guidelines</h5>
        <ul className="text-sm text-blue-600 pl-3 mb-0">
          <li>Be honest and constructive in your feedback</li>
          <li>Focus on your personal experience</li>
          <li>Avoid sharing personal medical information</li>
          <li>Keep your review respectful and professional</li>
        </ul>
      </div>

      {/* Submit Button */}
      <div className="flex gap-2">
        <Button
          label="Skip Review"
          outlined
          className="flex-1"
          onClick={onSubmit}
        />
        <Button
          label="Submit Review"
          icon="pi pi-star"
          className="flex-1"
          onClick={handleSubmit}
          loading={loading}
          disabled={reviewData.rating === 0}
        />
      </div>
    </Card>
  );
};

export default ReviewForm;