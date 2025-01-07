import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import SearchAndFilter from './SearchAndFilter';
import { Container, Grid, Typography, Box, CircularProgress } from '@mui/material';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    priceRange: [0, 1000],
    sortBy: 'name',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams({
        search: filters.search,
        category: filters.category,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        sortBy: filters.sortBy,
      });

      const response = await fetch(`/api/products?${queryParams}`);
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setLoading(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Our Fresh Seafood Selection
      </Typography>
      
      <SearchAndFilter onFilterChange={handleFilterChange} />
      
      {products.length === 0 ? (
        <Typography>No products found matching your criteria</Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProductList;
