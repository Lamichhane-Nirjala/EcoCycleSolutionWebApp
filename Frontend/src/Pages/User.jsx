// User Profile - shows user information from admin dashboard
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { Sidebar } from "../components/Sidebar";
import { Header, PageContainer } from "../components/Header";
import { LoadingPage } from "../components/Loader";

export default function User() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const adminMenuItems = [
    { icon: "📊", label: "Dashboard", href: "/admin-dashboard" },
    { icon: "🚚", label: "Pickups", href: "/admin-pickups" },
    { icon: "👥", label: "Users", href: "/admin-users" },
  ];

  useEffect(() => {
    fetchUsers();
    const refreshInterval = setInterval(fetchUsers, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/all");
      
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <LoadingPage message="Loading users..." />;

  return (
    <div className="dashboard-layout">
      <Sidebar items={adminMenuItems} onLogout={handleLogout} />

      <main className="main-content">
        <Header
          title="Users 👥"
          subtitle="All registered users in the system"
        />

        <PageContainer>
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            border: "1px solid #e5e7eb",
            overflowX: "auto"
          }}>
            {users.length === 0 ? (
              <p style={{ textAlign: "center", color: "#6b7280" }}>
                No users found
              </p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#6b7280" }}>Name</th>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#6b7280" }}>Email</th>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#6b7280" }}>City</th>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#6b7280" }}>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "12px", fontSize: "14px" }}>{user.username}</td>
                      <td style={{ padding: "12px", fontSize: "14px", color: "#6b7280" }}>{user.email}</td>
                      <td style={{ padding: "12px", fontSize: "14px" }}>{user.city || "-"}</td>
                      <td style={{ padding: "12px", fontSize: "14px" }}>
                        <span style={{
                          backgroundColor: user.usertype === "Admin" ? "#bfdbfe" : "#d1fae5",
                          color: user.usertype === "Admin" ? "#1e40af" : "#065f46",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600"
                        }}>
                          {user.usertype}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
