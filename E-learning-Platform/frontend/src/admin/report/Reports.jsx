import React, { useState, useEffect } from "react";
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../main";
import "./reports.css";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import dayjs from "dayjs"; // npm install dayjs

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const TIME_OPTIONS = [
  { label: "All Time", value: "all" },
  { label: "Daily", value: "daily" },
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "6 Months", value: "6months" },
  { label: "Yearly", value: "yearly" },
];

const SalesReports = () => {
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [courseReports, setCourseReports] = useState([]);
  const [payments, setPayments] = useState([]);
  const [timeRange, setTimeRange] = useState("monthly");
  const [coursePrices, setCoursePrices] = useState({}); // New state for course prices

  // Add state for collapsible sections
  const [openSection, setOpenSection] = useState({
    salesReport: true,
    pieChart: false,
  });

  const toggleSection = (section) => {
    setOpenSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    async function fetchReports() {
      try {
        const { data } = await axios.get(`${server}/api/admin/report-data`, {
          headers: { token: localStorage.getItem("token") },
        });
        setUserCount(data.userCount);
        setAdminCount(data.adminCount);
        setTotalCourses(data.courseReports.length);
        setCourseReports(data.courseReports);
        setPayments(data.payments || []);
        console.log("Payments from API:", data.payments);
        // Debug: Log the first payment to see its structure
        if (data.payments && data.payments.length > 0) {
          console.log("First payment structure:", data.payments[0]);
        }
        // Debug: Log the courseReports to check if prices are included
        console.log("Course Reports:", data.courseReports);
        if (data.courseReports && data.courseReports.length > 0) {
          console.log("First course structure:", data.courseReports[0]);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchReports();
  }, []);

  // Log the full structure of the first course report
  useEffect(() => {
    if (courseReports.length > 0) {
      console.log("=== FULL COURSE REPORT STRUCTURE ===");
      console.log(JSON.stringify(courseReports[0], null, 2));
    }
  }, [courseReports]);

  // New useEffect to fetch course prices
  useEffect(() => {
    async function fetchCoursePrices() {
      try {
        // Try to fetch course prices from the admin API
        const { data } = await axios.get(`${server}/api/admin/courses`, {
          headers: { token: localStorage.getItem("token") },
        });
        
        console.log("=== COURSE PRICES FROM ADMIN API ===");
        console.log("All courses from API:", data.courses);
        
        // Create a map of course IDs to prices
        const prices = {};
        if (data.courses && Array.isArray(data.courses)) {
          data.courses.forEach(course => {
            console.log("-----------------------------------");
            console.log("Course ID:", course._id);
            console.log("Course Title:", course.title || course.name);
            console.log("Course Price:", course.price);
            
            // Make sure we're accessing the 'price' field directly
            if (course._id && course.price !== undefined) {
              prices[course._id] = Number(course.price); // Convert to number to ensure proper calculation
              console.log(`Added to prices map: Course ID: ${course._id}, Price: ${course.price}`);
            } else {
              console.log("WARNING: Missing ID or price for course:", course.title || course.name || "Unknown course");
            }
          });
        } else {
          console.log("WARNING: No courses found in the response or invalid format");
        }
        
        console.log("=== COURSE PRICES MAP ===");
        console.log("Course Prices Map:", prices);
        console.log("Number of courses with prices:", Object.keys(prices).length);
        
        setCoursePrices(prices);
      } catch (err) {
        console.error("Error fetching course prices:", err);
        console.log("Trying alternative endpoint...");
        
        // Try an alternative endpoint if the first one fails
        try {
          const { data } = await axios.get(`${server}/api/course/all`, {
            headers: { token: localStorage.getItem("token") },
          });
          
          console.log("=== COURSE PRICES FROM ALTERNATIVE API ===");
          console.log("All courses from API:", data.courses);
          
          // Create a map of course IDs to prices
          const prices = {};
          if (data.courses && Array.isArray(data.courses)) {
            data.courses.forEach(course => {
              if (course._id && course.price !== undefined) {
                prices[course._id] = Number(course.price);
              }
            });
          }
          
          console.log("=== COURSE PRICES MAP (ALTERNATIVE) ===");
          console.log("Course Prices Map:", prices);
          console.log("Number of courses with prices:", Object.keys(prices).length);
          
          setCoursePrices(prices);
        } catch (altErr) {
          console.error("Error fetching course prices from alternative endpoint:", altErr);
        }
      }
    }
    
    fetchCoursePrices();
  }, []);

  // Helper to get start date based on selected time range
  const getStartDate = () => {
    const now = dayjs();
    switch (timeRange) {
      case "all":
        return dayjs("1970-01-01"); // very old date
      case "daily":
        return now.startOf("day");
      case "monthly":
        return now.subtract(1, "month");
      case "quarterly":
        return now.subtract(3, "month");
      case "6months":
        return now.subtract(6, "month");
      case "yearly":
        return now.subtract(1, "year");
      default:
        return now.subtract(1, "month");
    }
  };

  // Filter payments by selected time range
  const filteredPayments = payments.filter(payment => 
    dayjs(payment.createdAt).isAfter(getStartDate())
  );

  console.log("Filtered Payments:", filteredPayments);
  
  // Debug: Log the first filtered payment to see its structure
  if (filteredPayments.length > 0) {
    console.log("First filtered payment structure:", filteredPayments[0]);
  }

  // Calculate purchases per course for filtered payments
  const purchaseCountMap = {};
  const salesAmountMap = {};
  
  // First, count purchases per course (units sold)
  filteredPayments.forEach(payment => {
    if (payment.courseId) {
      const key = payment.courseId.toString();
      purchaseCountMap[key] = (purchaseCountMap[key] || 0) + 1;
    }
  });
  
  console.log("Purchase Count Map:", purchaseCountMap);
  console.log("Course Reports:", courseReports);
  console.log("Course Prices:", coursePrices);
  
  // Log all course IDs from courseReports
  console.log("Course IDs from courseReports:", courseReports.map(c => c._id));
  
  // Log all course IDs from coursePrices
  console.log("Course IDs from coursePrices:", Object.keys(coursePrices));
  
  // Then calculate sales amount based on course prices from the database
  Object.keys(purchaseCountMap).forEach(courseId => {
    // Get the price from the coursePrices map
    const price = coursePrices[courseId];
    const unitsSold = purchaseCountMap[courseId];
    
    // Only calculate sales amount if we have a valid price
    if (price !== undefined) {
      salesAmountMap[courseId] = unitsSold * price;
      
      // Find the course name for logging
      const course = courseReports.find(c => c._id === courseId);
      const courseName = course ? course.name : `Course ${courseId}`;
      
      console.log(`Course: ${courseName}, ID: ${courseId}, Units Sold: ${unitsSold}, Price: ${price}, Total: ${salesAmountMap[courseId]}`);
      console.log(`Course ID in coursePrices: ${courseId in coursePrices ? 'Yes' : 'No'}`);
    } else {
      console.log(`WARNING: No price found for course ID: ${courseId}`);
    }
  });

  // Calculate total sales amount
  const totalSalesAmount = Object.values(salesAmountMap).reduce((sum, amount) => sum + amount, 0);

  console.log("Sales Amount Map:", salesAmountMap);
  console.log("Total sales amount:", totalSalesAmount);

  // Prepare pie chart data based on filtered purchases
  const filteredCourseReports = courseReports.map(course => ({
    name: course.name,
    purchasedBy: purchaseCountMap[course._id?.toString()] || 0,
    salesAmount: salesAmountMap[course._id?.toString()] || 0,
  }));

  const pieData = {
    labels: filteredCourseReports.map(c => c.name),
    datasets: [
      {
        label: "Sales Amount (₹)",
        data: filteredCourseReports.map(c => c.salesAmount),
        backgroundColor: [
          "#007bff", "#28a745", "#ffc107", "#dc3545", "#17a2b8", "#6610f2", "#fd7e14", "#6f42c1"
        ],
        borderWidth: 1,
      },
    ],
  };

  console.log("Pie Data:", pieData);

  return (
    <Layout>
      <div className="student-dashboard111">
      <div className="reports-page">
        <div className="reports-main-content">
          <h2 className="reports-title">Sales Reports</h2> <br />
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="card-grid">
                <div className="report-box">
                  <h3>Total Sales</h3>
                  <p>₹{totalSalesAmount.toLocaleString()}</p>
                </div>
                <div className="report-box">
                  <h3>Total Transactions</h3>
                  <p>{filteredPayments.length}</p>
                </div>
                <div className="report-box">
                  <h3>Average Transaction</h3>
                  <p>₹{(totalSalesAmount / (filteredPayments.length || 1)).toLocaleString()}</p>
                </div>
              </div>

              {/* Sales Report Section */}
              <div className="report-section">
                <h3
                  className="collapsible-title"
                  onClick={() => toggleSection("salesReport")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Sales Report
                  <span className="dropdown-arrow">
                    {openSection.salesReport ? "▲" : "▼"}
                  </span>
                </h3>
                {openSection.salesReport && (
                  <>
                    <div className="time-filter-container" style={{ 
                      marginBottom: "20px", 
                      display: "flex", 
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px"
                    }}>
                      <label htmlFor="salesTimeRange" style={{ fontWeight: "bold" }}>Filter by Time Period:</label>
                      <select
                        id="salesTimeRange"
                        value={timeRange}
                        onChange={e => setTimeRange(e.target.value)}
                        style={{ 
                          padding: "8px 12px", 
                          borderRadius: "4px", 
                          border: "1px solid #ccc",
                          backgroundColor: "#f8f9fa",
                          cursor: "pointer",
                          fontSize: "14px"
                        }}
                      >
                        {TIME_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Sales Report Table with Actual Prices */}
                    <div className="sales-report-container">
                      <h4>Course Sales Summary</h4>
                      <table className="report-table" style={{ borderCollapse: "collapse" }}>
                        <thead>
                          <tr>
                            <th style={{ borderBottom: "2px solid #ddd", borderRight: "1px solid #ddd" }}>Course Name</th>
                            <th style={{ borderBottom: "2px solid #ddd", borderRight: "1px solid #ddd" }}>Units Sold</th>
                            <th style={{ borderBottom: "2px solid #ddd", borderRight: "1px solid #ddd" }}>Price (₹)</th>
                            <th style={{ borderBottom: "2px solid #ddd" }}>Sales Amount (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {courseReports.map((course, idx) => {
                            // Get the number of purchases for this course
                            const unitsSold = purchaseCountMap[course._id] || 0;
                            
                            // Get the actual price from the coursePrices map
                            const price = coursePrices[course._id];
                            
                            // Only show sales amount if we have a valid price
                            const salesAmount = price !== undefined ? unitsSold * price : null;
                            
                            return (
                              <tr key={idx}>
                                <td style={{ borderBottom: "1px solid #ddd", borderRight: "1px solid #ddd" }}>{course.name}</td>
                                <td style={{ borderBottom: "1px solid #ddd", borderRight: "1px solid #ddd" }}>{unitsSold}</td>
                                <td style={{ borderBottom: "1px solid #ddd", borderRight: "1px solid #ddd" }}>{price !== undefined ? `₹${price.toLocaleString()}` : 'N/A'}</td>
                                <td style={{ borderBottom: "1px solid #ddd" }}>{salesAmount !== null ? `₹${salesAmount.toLocaleString()}` : 'N/A'}</td>
                              </tr>
                            );
                          })}
                          <tr style={{ fontWeight: "bold", backgroundColor: "#f8f9fa" }}>
                            <td style={{ borderBottom: "1px solid #ddd", borderRight: "1px solid #ddd" }}>Total</td>
                            <td style={{ borderBottom: "1px solid #ddd", borderRight: "1px solid #ddd" }}>{filteredPayments.length}</td>
                            <td style={{ borderBottom: "1px solid #ddd", borderRight: "1px solid #ddd" }}></td>
                            <td style={{ borderBottom: "1px solid #ddd" }}>₹{totalSalesAmount.toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>

              {/* Sales Distribution Pie Chart */}
              <div className="report-section">
                <h3
                  className="collapsible-title"
                  onClick={() => toggleSection("pieChart")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Sales Distribution Pie Chart
                  <span className="dropdown-arrow">
                    {openSection.pieChart ? "▲" : "▼"}
                  </span>
                </h3>
                {openSection.pieChart && (
                  <div style={{ maxWidth: 500, margin: "0 auto" }}>
                    <Pie
                      data={pieData}
                      options={{
                        plugins: {
                          title: {
                            display: true,
                            text: "Sales Distribution by Course"
                          }
                        },
                        cutout: "60%",
                      }}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default SalesReports;