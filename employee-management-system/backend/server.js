const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if DB connection fails
  }
};

// Employee Schema
const EmployeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true, min: 20, max: 70 },
  dateOfJoining: { type: Date, required: true },
  title: { type: String, required: true },
  department: { type: String, required: true },
  employeeType: { type: String, required: true },
  currentStatus: { type: Boolean, default: true },
});

const Employee = mongoose.model('Employee', EmployeeSchema);

// GraphQL Schema (Type Definitions)
const typeDefs = gql`
  scalar Date

  type RetirementInfo {
    yearsLeft: Int!
    monthsLeft: Int!
    daysLeft: Int!
  }

  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    age: Int!
    dateOfJoining: Date!
    title: String!
    department: String!
    employeeType: String!
    currentStatus: Boolean!
    retirementInfo: RetirementInfo
  }

  type Query {
    getEmployees(employeeType: String): [Employee]
    getEmployee(id: ID!): Employee
    getUpcomingRetirements: [Employee]
  }

  type Mutation {
    createEmployee(
      firstName: String!,
      lastName: String!,
      age: Int!,
      dateOfJoining: Date!,
      title: String!,
      department: String!,
      employeeType: String!
    ): Employee

    updateEmployee(
      id: ID!,
      title: String,
      department: String,
      currentStatus: Boolean
    ): Employee

    deleteEmployee(id: ID!): Employee
  }
`;

// Helper function to calculate the retirement info (years, months, days left)
const calculateRetirementInfo = (dateOfJoining, ageAtJoining) => {
  const retirementAge = 65;
  const retirementDate = new Date(dateOfJoining);
  retirementDate.setFullYear(retirementDate.getFullYear() + (retirementAge - ageAtJoining));

  const currentDate = new Date();
  const timeDiff = retirementDate - currentDate;

  if (timeDiff <= 0) {
    return { yearsLeft: 0, monthsLeft: 0, daysLeft: 0 };
  }

  const yearsLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365.25));
  const monthsLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
  const daysLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));

  return { yearsLeft, monthsLeft, daysLeft };
};

// GraphQL Resolvers
const resolvers = {
  Query: {
    // Fetch all employees, optionally filtered by employee type
    getEmployees: async (_, { employeeType }) => {
      try {
        const filter = employeeType ? { employeeType } : {};
        return await Employee.find(filter);
      } catch (error) {
        console.error('Error fetching employees:', error);
        throw new Error('Failed to fetch employees');
      }
    },

    // Fetch a specific employee by ID
    getEmployee: async (_, { id }) => {
      try {
        const employee = await Employee.findById(id);
        if (!employee) {
          throw new Error('Employee not found');
        }
    
        // Calculate retirement info
        const retirementInfo = calculateRetirementInfo(employee.dateOfJoining, employee.age);
    
        return { 
          ...employee.toObject(), 
          id: employee._id.toString(), 
          retirementInfo 
        };
      } catch (error) {
        console.error('Error fetching employee:', error);
        throw new Error('Failed to fetch employee');
      }
    },

    // Get employees who are one year away from retirement (64 years old)
    getUpcomingRetirements: async () => {
      try {
        const retirementAge = 65;
        const employees = await Employee.find();

        // Filter employees who are 64 years old (one year from retirement)
        const upcomingRetirements = employees.filter(employee => employee.age === retirementAge - 1);
        return upcomingRetirements;
      } catch (error) {
        console.error('Error fetching upcoming retirements:', error);
        throw new Error('Failed to fetch upcoming retirements');
      }
    },
  },

  Mutation: {
    // Create a new employee
    createEmployee: async (_, { firstName, lastName, age, dateOfJoining, title, department, employeeType }) => {
      try {
        if (!firstName || !lastName || !age || !dateOfJoining || !title || !department || !employeeType) {
          throw new Error('All fields are required');
        }

        const newEmployee = new Employee({
          firstName,
          lastName,
          age,
          dateOfJoining,
          title,
          department,
          employeeType,
        });
        return await newEmployee.save();
      } catch (error) {
        console.error('Error creating employee:', error);
        throw new Error('Failed to create employee');
      }
    },

    // Update an existing employee's details
    updateEmployee: async (_, { id, title, department, currentStatus }) => {
      try {
        const updateData = {};
        if (title) updateData.title = title;
        if (department) updateData.department = department;
        if (currentStatus !== undefined) updateData.currentStatus = currentStatus;

        const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedEmployee) {
          throw new Error('Employee not found');
        }
        return updatedEmployee;
      } catch (error) {
        console.error('Error updating employee:', error);
        throw new Error('Failed to update employee');
      }
    },

    // Delete an employee by ID
    deleteEmployee: async (_, { id }) => {
      try {
        const employee = await Employee.findById(id);
        if (!employee) {
          throw new Error('Employee not found');
        }

        if (employee.currentStatus) {
          throw new Error("CAN'T DELETE EMPLOYEE – STATUS ACTIVE");
        }

        const deletedEmployee = await Employee.findByIdAndDelete(id);
        return deletedEmployee;
      } catch (error) {
        console.error('Error deleting employee:', error);
        throw new Error(error.message || 'Failed to delete employee');
      }
    },
  },
};

// Set up Apollo Server
const startServer = async () => {
  try {
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();

    const app = express();
    
    // CORS setup: Allow requests from frontend
    app.use(cors({
      origin: 'http://localhost:3000', // Replace with your frontend URL if different
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
    }));

    // Apply Apollo middleware
    server.applyMiddleware({ app, path: '/graphql' });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('Error starting Apollo Server:', error);
  }
};

// Connect to MongoDB and start the server
connectDB().then(() => startServer());