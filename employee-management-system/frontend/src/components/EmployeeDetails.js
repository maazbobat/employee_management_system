import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Container, Grid, Card, CardContent, Typography, List, ListItem, ListItemText, Alert, Box, CircularProgress } from '@mui/material';

// GraphQL Query to get employee by ID
const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    getEmployee(id: $id) {
      id
      firstName
      lastName
      age
      dateOfJoining
      title
      department
      employeeType
      currentStatus
      retirementInfo {
        yearsLeft
        monthsLeft
        daysLeft
      }
    }
  }
`;

const EmployeeDetails = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_EMPLOYEE, {
    variables: { id },
  });

  // If loading, display CircularProgress
  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
      <CircularProgress />
    </Box>
  );

  // If error, display Alert message
  if (error) return (
    <Box sx={{ marginTop: 5 }}>
      <Alert severity="error">{`Error: ${error.message}`}</Alert>
    </Box>
  );

  const employee = data.getEmployee;
  const { retirementInfo } = employee;

  return (
    <Container sx={{ marginTop: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Employee Details
      </Typography>
      
      <Card sx={{ display: 'flex', flexDirection: 'column', padding: 3 }}>
        <CardContent>
          <Typography variant="h5" component="div" align="center">
            {`${employee.firstName} ${employee.lastName}`}
          </Typography>
          <Grid container spacing={3}>
            {/* Left side (Basic Info) */}
            <Grid item xs={12} sm={6}>
              <List>
                <ListItem>
                <ListItemText primary="Age" secondary={`${employee.age} (${new Date(employee.dateOfJoining).getFullYear()})`} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Date of Joining"
                    secondary={new Date(employee.dateOfJoining).toLocaleDateString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Title" secondary={employee.title} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Department" secondary={employee.department} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Employee Type" secondary={employee.employeeType} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Status"
                    secondary={employee.currentStatus ? 'Working' : 'Retired'}
                  />
                </ListItem>
              </List>
            </Grid>

            {/* Right side (Retirement Info) */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Retirement Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Years Left" secondary={`${retirementInfo.yearsLeft} years`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Months Left" secondary={`${retirementInfo.monthsLeft} months`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Days Left" secondary={`${retirementInfo.daysLeft} days`} />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EmployeeDetails;