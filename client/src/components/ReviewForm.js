import React, { useState } from 'react';
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Alert,
} from '@mui/material';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (formData.comment.length < 10) {
      setError('Review must be at least 10 characters long');
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({
          ...formData,
          product: productId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const data = await response.json();
      setSuccess('Review submitted successfully!');
      setFormData({ rating: 0, comment: '' });
      if (onReviewSubmitted) {
        onReviewSubmitted(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Write a Review
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      <Box sx={{ mb: 2 }}>
        <Typography component="legend">Rating</Typography>
        <Rating
          name="rating"
          value={formData.rating}
          onChange={(event, newValue) => {
            setFormData({ ...formData, rating: newValue });
          }}
          precision={0.5}
        />
      </Box>
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Your Review"
        value={formData.comment}
        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
        error={formData.comment.length > 0 && formData.comment.length < 10}
        helperText={
          formData.comment.length > 0 && formData.comment.length < 10
            ? 'Review must be at least 10 characters long'
            : ''
        }
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" color="primary">
        Submit Review
      </Button>
    </Box>
  );
};

export default ReviewForm;
