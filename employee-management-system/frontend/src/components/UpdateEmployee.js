import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button, Checkbox, FormControlLabel, Container, Typography, Box, CircularProgress, Alert } from '@mui/material';

// GraphQL mutation to update an employee
const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $id: ID!,
    $title: String,
    $department: String,
    $currentStatus: Boolean
  ) {
    updateEmployee(
      id: $id,
      title: $title,
      department: $department,
      currentStatus: $currentStatus
    ) {
      id
      firstName
      lastName
      title
      department
      currentStatus
    }
  }
`;

const UpdateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState({
    title: '',
    department: '',
    currentStatus: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE);

  useEffect(() => {
    // Fetch employee data by ID and set it to the state
    // Example: Fetch employee data here and set it
    // Replace this with actual fetch logic
    // For example, you could use a `useQuery` hook to fetch employee data by ID.
    setEmployeeData({
      title: 'Developer',
      department: 'Engineering',
      currentStatus: true,
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateEmployee({
        variables: {
          id,
          title: employeeData.title,
          department: employeeData.department,
          currentStatus: employeeData.currentStatus,
        },
      });
      navigate(`/employee/${id}`); // Navigate back to the employee details page
    } catch (err) {
      console.error('Error updating employee:', err);
      setError('Error updating employee.');
    } finally {
      setLoading(false);
    }
  };

  // Example values for dropdowns
  const titles = ['Manager', 'Developer', 'Designer', 'HR', 'Engineer'];
  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Update Employee
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Title */}
        <FormControl fullWidth>
          <InputLabel>Title</InputLabel>
          <Select
            value={employeeData.title}
            onChange={(e) =>
              setEmployeeData({ ...employeeData, title: e.target.value })
            }
            label="Title"
            required
          >
            {titles.map((title) => (
              <MenuItem key={title} value={title}>
                {title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Department */}
        <FormControl fullWidth>
          <InputLabel>Department</InputLabel>
          <Select
            value={employeeData.department}
            onChange={(e) =>
              setEmployeeData({ ...employeeData, department: e.target.value })
            }
            label="Department"
            required
          >
            {departments.map((department) => (
              <MenuItem key={department} value={department}>
                {department}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status */}
        <FormControlLabel
          control={
            <Checkbox
              checked={employeeData.currentStatus}
              onChange={(e) =>
                setEmployeeData({
                  ...employeeData,
                  currentStatus: e.target.checked,
                })
              }
            />
          }
          label="Currently Active"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Update Employee'}
        </Button>
      </Box>
    </Container>
  );
};

export default UpdateEmployee;