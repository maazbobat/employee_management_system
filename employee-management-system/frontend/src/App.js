import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Drawer, List, ListItem, ListItemText, Toolbar, Typography, Button, Container, CssBaseline } from '@mui/material';
import EmployeeDirectory from './components/EmployeeDirectory';
import EmployeeCreate from './components/EmployeeCreate';
import EmployeeDetails from './components/EmployeeDetails';
import UpdateEmployee from './components/UpdateEmployee';
import UpcomingRetirements from './components/UpcomingRetirements';
import './App.css';

function App() {
  return (
    <Router>
      <div style={styles.container}>

        <div style={styles.mainContentContainer}>
          {/* Sidebar Menu */}
          <Drawer
            sx={{
              width: 240,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: 240,
                boxSizing: 'border-box',
                backgroundColor: '#282c34',
              },
            }}
            variant="permanent"
            anchor="left"
          >
            <div style={styles.sideMenu}>
              <List>
                <ListItem button component={Link} to="/directory">
                  <ListItemText primary="Employee List" style={styles.linkText} />
                </ListItem>
                <ListItem button component={Link} to="/create">
                  <ListItemText primary="Add Employee" style={styles.linkText} />
                </ListItem>
                <ListItem button component={Link} to="/retirements">
                  <ListItemText primary="Upcoming Retirements" style={styles.linkText} />
                </ListItem>
              </List>
            </div>
          </Drawer>

          {/* Main Content */}
          <main style={styles.mainContent}>
            <Container>
              <Routes>
                <Route path="/" element={<Typography variant="h4">Welcome to Employee Management</Typography>} />
                <Route path="/directory" element={<EmployeeDirectory />} />
                <Route path="/create" element={<EmployeeCreate />} />
                <Route path="/employee/:id" element={<EmployeeDetails />} />
                <Route path="/update-employee/:id" element={<UpdateEmployee />} />
                <Route path="/retirements" element={<UpcomingRetirements />} />
              </Routes>
            </Container>
          </main>
        </div>
      </div>
    </Router>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  mainContentContainer: {
    display: 'flex',
    flex: 1,
  },
  sideMenu: {
    width: '240px',
    backgroundColor: '#282c34',
    padding: '20px 10px',
    boxSizing: 'border-box',
  },
  mainContent: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#f5f5f5',
  },
  linkText: {
    color: 'white',
    fontSize: '16px',
  },
};

export default App;