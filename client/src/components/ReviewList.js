import React from 'react';
import {
  Box,
  Typography,
  Rating,
  Avatar,
  Paper,
  Divider,
} from '@mui/material';

const ReviewList = ({ reviews }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Customer Reviews
      </Typography>
      {reviews.length === 0 ? (
        <Typography color="textSecondary">No reviews yet</Typography>
      ) : (
        reviews.map((review) => (
          <Paper key={review._id} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ mr: 2 }}>
                {review.user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1">{review.user.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(review.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
            <Rating value={review.rating} readOnly precision={0.5} />
            <Typography variant="body1" sx={{ mt: 1 }}>
              {review.comment}
            </Typography>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default ReviewList;
