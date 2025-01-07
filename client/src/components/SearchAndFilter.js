import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Paper,
  Grid,
  Button,
} from '@mui/material';

const SearchAndFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    priceRange: [0, 1000],
    sortBy: 'name',
  });

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'fish', label: 'Fish' },
    { value: 'shellfish', label: 'Shellfish' },
    { value: 'crustaceans', label: 'Crustaceans' },
    { value: 'other', label: 'Other' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'price_asc', label: 'Price (Low to High)' },
    { value: 'price_desc', label: 'Price (High to Low)' },
  ];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search Products"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search by name or description..."
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              label="Category"
              onChange={(e) => handleChange('category', e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              label="Sort By"
              onChange={(e) => handleChange('sortBy', e.target.value)}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography gutterBottom>Price Range</Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={filters.priceRange}
              onChange={(e, newValue) => handleChange('priceRange', newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              marks={[
                { value: 0, label: '$0' },
                { value: 250, label: '$250' },
                { value: 500, label: '$500' },
                { value: 750, label: '$750' },
                { value: 1000, label: '$1000' },
              ]}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            onClick={() => {
              setFilters({
                search: '',
                category: 'all',
                priceRange: [0, 1000],
                sortBy: 'name',
              });
              onFilterChange({
                search: '',
                category: 'all',
                priceRange: [0, 1000],
                sortBy: 'name',
              });
            }}
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SearchAndFilter;
