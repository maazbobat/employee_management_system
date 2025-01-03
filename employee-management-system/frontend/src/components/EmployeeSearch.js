import React from 'react';
import { Container, TextField, Typography, Grid, Box } from '@mui/material';

const EmployeeSearch = () => {
  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Search Employees
      </Typography>

      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextField
              label="Search by Name"
              variant="outlined"
              fullWidth
              placeholder="Enter employee name"
              sx={{ marginBottom: 2 }}
            />
            <Typography variant="body2" color="text.secondary">
              Enter the first or last name to search.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmployeeSearch;