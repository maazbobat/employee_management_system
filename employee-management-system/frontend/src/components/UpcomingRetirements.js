import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Typography } from '@mui/material';

function UpcomingRetirements() {
  const [retirements, setRetirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            getUpcomingRetirements {
              id
              firstName
              lastName
              age
              title
              department
              employeeType
            }
          }
        `,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.errors) {
          console.error('GraphQL errors:', data.errors);
          setError('An error occurred while fetching retirements.');
        } else {
          setRetirements(data.data.getUpcomingRetirements || []);
        }
      })
      .catch(error => {
        console.error('Error fetching retirements:', error);
        setError('Error fetching retirements. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Upcoming Retirements</Typography>
      {retirements.length ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Retirement Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {retirements.map(employee => (
                <TableRow key={employee.id}>
                  <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                  <TableCell>{employee.age}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.title}</TableCell>
                  <TableCell>Retirement in 1 year</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1">No upcoming retirements.</Typography>
      )}
    </div>
  );
}

export default UpcomingRetirements;