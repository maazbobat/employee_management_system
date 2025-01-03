import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Container, Select, MenuItem, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Paper } from '@mui/material';

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

const EmployeeDirectory = ({ searchTerm }) => {
  const [employeeType, setEmployeeType] = useState('');  // State to manage selected employeeType

  // Query to fetch employees, with employeeType as a variable
  const { loading, error, data, refetch } = useQuery(GET_EMPLOYEES, {
    variables: { employeeType },
    fetchPolicy: 'cache-and-network',  // Fetch from both network and cache
  });

  // Query for fetching upcoming retirements
  const { data: upcomingRetirementsData, loading: loadingUpcomingRetirements } = useQuery(GET_UPCOMING_RETIREMENTS);

  const handleEmployeeTypeChange = (e) => {
    const selectedEmployeeType = e.target.value;
    setEmployeeType(selectedEmployeeType);
    refetch({ employeeType: selectedEmployeeType }); // Refetch the query with the updated employeeType
  };

  const formatDate = (date) => {
    const parsedDate = new Date(date); // This works for both timestamp and ISO date strings
    
    if (isNaN(parsedDate)) {
      console.error("Invalid date format:", date);
      return "Invalid Date";  // Return a fallback value if the date is invalid
    }
  
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return parsedDate.toLocaleDateString('en-US', options);  // Return the formatted date
  };

  if (loading || loadingUpcomingRetirements) return <p>Loading...</p>;
  if (error) {
    console.error("Error fetching employees:", error);
    return <p>Error: Something went wrong while fetching employee data.</p>;
  }

  // Filter employees based on the search term
  const filteredEmployees = data.getEmployees.filter(employee =>
    `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter employees for Upcoming Retirements (aged 64)
  const upcomingRetirements = filteredEmployees.filter(employee => employee.age === 64);

  // Combine the filtering based on selected filter
  let displayedEmployees = filteredEmployees;
  
  // If "Upcoming Retirement" filter is selected, display upcoming retirements (aged 64)
  if (employeeType === 'UpcomingRetirement') {
    displayedEmployees = upcomingRetirements; // Only show employees whose age is 64
  }

  return (
    <Container sx={{ marginTop: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Employee Management System
      </Typography>
      <FormControl fullWidth sx={{ marginBottom: 3 }}>
        <InputLabel id="employeeType">Filter by Employee Type</InputLabel>
        <Select
          labelId="employeeType"
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

      <Typography variant="h6" gutterBottom>
        {employeeType === 'UpcomingRetirement' ? 'Employees with Upcoming Retirements' : 'Employee Directory'}
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="employee table">
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
                    <Link to={`/employee/${employee.id}`} style={{ textDecoration: 'none' }}>
                      <Button variant="contained" color="primary" size="small">
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      color="warning" 
                      size="small" 
                      onClick={() => handleUpdate(employee.id)}
                    >
                      Update
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small" 
                      onClick={() => handleDelete(employee.id)}
                      sx={{ marginLeft: 1 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No employees found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default EmployeeDirectory;