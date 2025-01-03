import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Grid, FormControl, InputLabel, Select, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Paper } from '@mui/material';

// GraphQL Query to get employees with optional employeeType filter
export const GET_EMPLOYEES = gql`
  query GetEmployees($employeeType: String) {
    getEmployees(employeeType: $employeeType) {
      id
      firstName
      lastName
      age
      dateOfJoining
      title
      department
      employeeType
      currentStatus
    }
  }
`;

// GraphQL Query to get upcoming retirements
export const GET_UPCOMING_RETIREMENTS = gql`
  query GetUpcomingRetirements {
    getUpcomingRetirements {
      id
      firstName
      lastName
      age
      dateOfJoining
      title
      department
      employeeType
      currentStatus
    }
  }
`;

// GraphQL Mutation to delete an employee
export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id) {
      id
    }
  }
`;

const EmployeeDirectory = ({ searchTerm = '' }) => {
  const [employeeType, setEmployeeType] = useState(''); // State for selected employee type
  const navigate = useNavigate(); // useNavigate hook for navigation

  // Query for fetching employees based on employeeType filter
  const { loading, error, data, refetch } = useQuery(GET_EMPLOYEES, {
    variables: { employeeType },
    fetchPolicy: 'cache-and-network', // Fetch from both network and cache
  });

  // Query for fetching upcoming retirements
  const { data: upcomingRetirementsData, loading: loadingUpcomingRetirements } = useQuery(GET_UPCOMING_RETIREMENTS);

  // GraphQL mutation for deleting an employee
  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    onCompleted: () => {
      alert('Employee deleted successfully');
      refetch(); // Refetch employees after deletion
    },
    onError: (error) => {
      console.error('Error deleting employee:', error);
      alert('Working Employees cannot be deleted!');
    },
  });

  // Handles employee type filter change
  const handleEmployeeTypeChange = (e) => {
    const selectedEmployeeType = e.target.value;
    setEmployeeType(selectedEmployeeType);
    refetch({ employeeType: selectedEmployeeType }); // Refetch employees with the updated filter
  };

  // Handles deleting an employee after confirmation
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
    if (confirmDelete) {
      await deleteEmployee({ variables: { id } });
    }
  };

  // Handles navigating to the employee update page
  const handleUpdate = (id) => {
    navigate(`/update-employee/${id}`);
  };

  // Format date for displaying the employee's date of joining
  const formatDate = (date) => {
    const parsedDate = new Date(date); // This works for both timestamp and ISO date strings
    
    if (isNaN(parsedDate)) {
      console.error("Invalid date format:", date);
      return "Invalid Date";  // Return a fallback value if the date is invalid
    }
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return parsedDate.toLocaleDateString('en-US', options);  // Return the formatted date
  };

  // If data is still loading
  if (loading || loadingUpcomingRetirements) return <CircularProgress size={50} sx={{ display: 'block', margin: '0 auto' }} />;

  // If there was an error fetching the data
  if (error) {
    console.error('Error fetching employees:', error);
    return <Alert severity="error">Error: Something went wrong while fetching employee data.</Alert>;
  }

  // Filter employees based on the search term
  const filteredEmployees = data.getEmployees.filter((employee) =>
    `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Combine the filtering based on selected filter
  let displayedEmployees = filteredEmployees;
  
  // If "Upcoming Retirement" filter is selected, display upcoming retirements
  if (employeeType === 'UpcomingRetirement') {
    displayedEmployees = upcomingRetirementsData.getUpcomingRetirements || [];
  } else if (employeeType && employeeType !== 'UpcomingRetirement') {
    // Apply employee type filter
    displayedEmployees = filteredEmployees.filter(employee => employee.employeeType === employeeType);
  }

  return (
    <Container sx={{ marginTop: 5 }}>
      <h1 className="text-center mb-4">Employee Management System</h1>
      
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>Filter by Employee Type</InputLabel>
        <Select
          value={employeeType}
          onChange={handleEmployeeTypeChange}
          label="Filter by Employee Type"
        >
          <MenuItem value="">All Employees</MenuItem>
          <MenuItem value="FullTime">Full Time</MenuItem>
          <MenuItem value="PartTime">Part Time</MenuItem>
          <MenuItem value="Contract">Contract</MenuItem>
          <MenuItem value="Seasonal">Seasonal</MenuItem>
          <MenuItem value="UpcomingRetirement">Upcoming Retirement</MenuItem>
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Date of Joining</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Employee Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedEmployees.length > 0 ? (
              displayedEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.firstName}</TableCell>
                  <TableCell>{employee.lastName}</TableCell>
                  <TableCell>{employee.age}</TableCell>
                  <TableCell>{formatDate(employee.dateOfJoining)}</TableCell>
                  <TableCell>{employee.title}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.employeeType}</TableCell>
                  <TableCell>{employee.currentStatus ? 'Working' : 'Retired'}</TableCell>
                  <TableCell>
                    <Link to={`/employee/${employee.id}`}>
                      <Button variant="contained" color="info" size="small">
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="warning" size="small" onClick={() => handleUpdate(employee.id)}>
                      Update
                    </Button>
                    <Button variant="contained" color="error" size="small" onClick={() => handleDelete(employee.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">No employees found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default EmployeeDirectory;