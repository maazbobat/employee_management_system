import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Container, TextField, Button, Grid, MenuItem, Select, InputLabel, FormControl, Typography, CircularProgress, Alert } from '@mui/material';

// GraphQL Mutation to create an employee
const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee(
    $firstName: String!,
    $lastName: String!,
    $age: Int!,
    $dateOfJoining: Date!,
    $title: String!,
    $department: String!,
    $employeeType: String!
  ) {
    createEmployee(
      firstName: $firstName,
      lastName: $lastName,
      age: $age,
      dateOfJoining: $dateOfJoining,
      title: $title,
      department: $department,
      employeeType: $employeeType
    ) {
      id
      firstName
      lastName
    }
  }
`;

const EmployeeCreate = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    dateOfJoining: '',
    title: 'Employee',
    department: 'IT',
    employeeType: 'FullTime',
  });

  const [createEmployee] = useMutation(CREATE_EMPLOYEE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, age, dateOfJoining, title, department, employeeType } = formData;

    setLoading(true);

    try {
      await createEmployee({
        variables: {
          firstName,
          lastName,
          age: parseInt(age),
          dateOfJoining,
          title,
          department,
          employeeType,
        },
      });
      alert('Employee Created Successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        age: '',
        dateOfJoining: '',
        title: 'Employee',
        department: 'IT',
        employeeType: 'FullTime',
      });
    } catch (error) {
      setError('Error creating employee.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Create Employee
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* First Name and Last Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* Age and Date of Joining */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Age"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date of Joining"
              type="date"
              name="dateOfJoining"
              value={formData.dateOfJoining}
              onChange={handleInputChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/* Employee Type and Title */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Employee Type</InputLabel>
              <Select
                name="employeeType"
                value={formData.employeeType}
                onChange={handleInputChange}
              >
                <MenuItem value="FullTime">Full Time</MenuItem>
                <MenuItem value="PartTime">Part Time</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Title</InputLabel>
              <Select
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              >
                <MenuItem value="Employee">Employee</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Director">Director</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Department */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
              >
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Engineering">Engineering</MenuItem>
                <MenuItem value="Sales">Sales</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          sx={{ marginTop: 3 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Employee'}
        </Button>
      </form>
    </Container>
  );
};

export default EmployeeCreate;