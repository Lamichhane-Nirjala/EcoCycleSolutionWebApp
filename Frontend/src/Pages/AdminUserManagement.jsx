import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header, PageContainer } from "../components/Header";
import { Table } from "../components/Table";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { Input, FormGroup } from "../components/Form";
import { LoadingPage } from "../components/Loader";
import { toast } from "react-toastify";
import "../style/AdminUserManagement.css";

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [editData, setEditData] = useState({});

  const token = localStorage.getItem("token");

  const adminMenuItems = [
    { icon: "📊", label: "Dashboard", href: "/admin-dashboard" },
    { icon: "👥", label: "Users", href: "/admin-users" },
    { icon: "🚚", label: "Pickups", href: "/admin-dashboard" },
    { icon: "📈", label: "Analytics", href: "/admin-dashboard" },
    { icon: "⚙️", label: "Settings", href: "/admin-dashboard" },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Mock data - In production, fetch from API
      const mockUsers = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "555-1234",
          city: "New York",
          usertype: "User",
          createdAt: "2026-01-15",
          pickups: 12,
          totalWaste: 45.5,
          ecoPoints: 1250,
          status: "Active",
        },
        {
          id: 2,
          name: "Maria Silva",
          email: "maria@example.com",
          phone: "555-5678",
          city: "Los Angeles",
          usertype: "Admin",
          createdAt: "2026-01-10",
          pickups: 0,
          totalWaste: 0,
          ecoPoints: 0,
          status: "Active",
        },
        {
          id: 3,
          name: "James Chen",
          email: "james@example.com",
          phone: "555-9012",
          city: "Chicago",
          usertype: "User",
          createdAt: "2025-12-20",
          pickups: 8,
          totalWaste: 32.3,
          ecoPoints: 890,
          status: "Active",
        },
        {
          id: 4,
          name: "Sofia Lopez",
          email: "sofia@example.com",
          phone: "555-3456",
          city: "Houston",
          usertype: "User",
          createdAt: "2025-12-01",
          pickups: 5,
          totalWaste: 18.7,
          ecoPoints: 520,
          status: "Inactive",
        },
        {
          id: 5,
          name: "Emma Davis",
          email: "emma@example.com",
          phone: "555-7890",
          city: "Phoenix",
          usertype: "User",
          createdAt: "2025-11-15",
          pickups: 15,
          totalWaste: 62.1,
          ecoPoints: 1650,
          status: "Active",
        },
      ];

      setUsers(mockUsers);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      usertype: user.usertype,
      status: user.status,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      // In production, make API call to update user
      const updatedUsers = users.map((u) =>
        u.id === selectedUser.id ? { ...u, ...editData } : u
      );
      setUsers(updatedUsers);
      toast.success("User updated successfully");
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        // In production, make API call to delete
        setUsers(users.filter((u) => u.id !== userId));
        toast.success("User deleted successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete user");
      }
    }
  };

  if (loading) return <LoadingPage message="Loading users..." />;

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.usertype === filterRole;
    return matchesSearch && matchesRole;
  });

  const statusBadge = (status) => (
    <div className={`badge badge-${status.toLowerCase()}`}>{status}</div>
  );

  const columns = [
    {
      key: "name",
      label: "Name",
      width: "150px",
      render: (name, row) => (
        <div>
          <strong>{name}</strong>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>
            {row.email}
          </div>
        </div>
      ),
    },
    {
      key: "city",
      label: "City",
      width: "100px",
    },
    {
      key: "usertype",
      label: "Role",
      width: "80px",
      render: (type) => (
        <div className={`badge badge-${type.toLowerCase()}`}>{type}</div>
      ),
    },
    {
      key: "pickups",
      label: "Pickups",
      width: "80px",
      render: (pickups) => <strong>{pickups}</strong>,
    },
    {
      key: "totalWaste",
      label: "Total Waste",
      width: "100px",
      render: (waste) => `${waste} kg`,
    },
    {
      key: "ecoPoints",
      label: "Eco Points",
      width: "100px",
      render: (points) => (
        <span style={{ color: "#4ade80", fontWeight: "600" }}>
          {points}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "100px",
      render: statusBadge,
    },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar items={adminMenuItems} onLogout={handleLogout} />

      <main className="main-content">
        <Header
          title="User Management 👥"
          subtitle="Manage and monitor all system users"
        />

        <PageContainer>
          {/* Filters */}
          <div className="user-filters">
            <Input
              type="search"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="form-select"
            >
              <option value="all">All Roles</option>
              <option value="User">Users</option>
              <option value="Admin">Admins</option>
            </select>
          </div>

          {/* User Stats */}
          <div className="user-stats">
            <div className="stat-card">
              <div className="stat-value">{users.length}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {users.filter((u) => u.status === "Active").length}
              </div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {users.filter((u) => u.usertype === "Admin").length}
              </div>
              <div className="stat-label">Admins</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {users.reduce((sum, u) => sum + u.pickups, 0)}
              </div>
              <div className="stat-label">Total Pickups</div>
            </div>
          </div>

          {/* Users Table */}
          <Table
            columns={columns}
            data={filteredUsers}
            actions={(row) => (
              <div className="row-actions">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleViewDetails(row)}
                >
                  View
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEditUser(row)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteUser(row.id)}
                >
                  Delete
                </Button>
              </div>
            )}
          />
        </PageContainer>
      </main>

      {/* View Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="User Details"
        footer={
          <Button variant="primary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        }
      >
        {selectedUser && (
          <div className="user-details">
            <div className="detail-row">
              <span>Name</span>
              <strong>{selectedUser.name}</strong>
            </div>
            <div className="detail-row">
              <span>Email</span>
              <strong>{selectedUser.email}</strong>
            </div>
            <div className="detail-row">
              <span>Phone</span>
              <strong>{selectedUser.phone}</strong>
            </div>
            <div className="detail-row">
              <span>City</span>
              <strong>{selectedUser.city}</strong>
            </div>
            <div className="detail-row">
              <span>Role</span>
              <strong>{selectedUser.usertype}</strong>
            </div>
            <div className="detail-row">
              <span>Status</span>
              <strong>{selectedUser.status}</strong>
            </div>
            <div className="detail-row">
              <span>Member Since</span>
              <strong>{selectedUser.createdAt}</strong>
            </div>
            <div className="detail-divider"></div>
            <div className="detail-row">
              <span>Total Pickups</span>
              <strong>{selectedUser.pickups}</strong>
            </div>
            <div className="detail-row">
              <span>Total Waste</span>
              <strong>{selectedUser.totalWaste} kg</strong>
            </div>
            <div className="detail-row">
              <span>Eco Points</span>
              <strong className="points">{selectedUser.ecoPoints}</strong>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit User"
        footer={
          <div style={{ display: "flex", gap: "12px" }}>
            <Button
              variant="secondary"
              onClick={() => setShowEditModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveEdit} fullWidth>
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="edit-form">
          <FormGroup label="Name">
            <Input
              value={editData.name || ""}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />
          </FormGroup>
          <FormGroup label="Email">
            <Input
              type="email"
              value={editData.email || ""}
              onChange={(e) =>
                setEditData({ ...editData, email: e.target.value })
              }
            />
          </FormGroup>
          <FormGroup label="Phone">
            <Input
              value={editData.phone || ""}
              onChange={(e) =>
                setEditData({ ...editData, phone: e.target.value })
              }
            />
          </FormGroup>
          <FormGroup label="City">
            <Input
              value={editData.city || ""}
              onChange={(e) =>
                setEditData({ ...editData, city: e.target.value })
              }
            />
          </FormGroup>
          <FormGroup label="Role">
            <select
              value={editData.usertype || ""}
              onChange={(e) =>
                setEditData({ ...editData, usertype: e.target.value })
              }
              className="form-select"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </FormGroup>
          <FormGroup label="Status">
            <select
              value={editData.status || ""}
              onChange={(e) =>
                setEditData({ ...editData, status: e.target.value })
              }
              className="form-select"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </FormGroup>
        </div>
      </Modal>
    </div>
  );
}
