import React, { useEffect, useState } from "react";
import "./users.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Layout from "../Utils/Layout";
import toast from "react-hot-toast";

const AdminUsers = ({ user }) => {
  const navigate = useNavigate();

  if (user && user.mainrole !== "superadmin") return navigate("/");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const { data } = await axios.get(`${server}/api/users`, {
        headers: {
          token: token
        },
      });
      
      if (data && data.users) {
      setUsers(data.users);
      } else {
        toast.error("No users data received");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 403) {
        toast.error("You don't have permission to view users");
      } else if (error.response?.status === 401) {
        toast.error("Session expired. Please login again");
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch users");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id) => {
    if (confirm("Are you sure you want to update this user's role?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login first");
          return;
        }

        const { data } = await axios.put(
          `${server}/api/user/${id}`,
          {},
          {
            headers: {
              token: token
            },
          }
        );
        toast.success(data.message);
        fetchUsers();
      } catch (error) {
        console.error("Role update error:", error);
        if (error.response?.status === 403) {
          toast.error("You don't have permission to update roles");
        } else if (error.response?.status === 401) {
          toast.error("Session expired. Please login again");
        } else {
          toast.error(error.response?.data?.message || "Failed to update role");
        }
      }
    }
  };

  return (
    <Layout>
      <div className="user-container">
        <div className="user-card">
          <h1 className="user-title">All Users</h1>
          <div className="table-wrapper">
            {loading ? (
              <div className="loading">Loading users...</div>
            ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Name</th>
                  <th>Email ID</th>
                  <th>User Role</th>
                  <th>Update Role</th>
                </tr>
              </thead>
              <tbody>
                  {users && users.length > 0 ? (
                  users.map((e, i) => (
                    <tr key={e._id}>
                      <td>{i + 1}</td>
                      <td>{e.name}</td>
                      <td>{e.email}</td>
                      <td>{e.role}</td>
                      <td>
                        <button
                          onClick={() => updateRole(e._id)}
                          className="update-btn"
                        >
                          Update Role
                        </button>
                      </td>
                    </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-data">
                        No users found
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminUsers;
