import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteUserById, getAllUser, updateUser } from "../../api/user";
import Swal from "sweetalert2";
import '../../assets/admin/css/UserManagement.css';

const DataTablesPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [form, setForm] = useState({
    id: "",
    email: "",
    lastName: "",
    firstName: "",
    username: "",
    phoneNumber: "",
    gender: "",
    birthDate: "",
  });

  const [file, setFile] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users when search or filters change
  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterRole, filterStatus]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUser();
      console.log(data);
      setUsers(data);
    } catch (e) {
      console.log(e);
      Swal.fire("Error!", "Failed to fetch users.", "error");
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (filterRole !== "all") {
      filtered = filtered.filter(user =>
        user.primaryRole === filterRole || user.roles?.includes(filterRole)
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(user =>
        filterStatus === "active" ? user.active === "ACTIVE" : user.active === "INACTIVE"
      );
    }

    setFilteredUsers(filtered);
  };

  const confirmDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      await handleDelete(id);
    }
  };

  const handleEdit = (user) => {
    setEditing(user.id);
    setForm({
      id: user.id,
      email: user.email,
      lastName: user.lastName || "",
      firstName: user.firstName || "",
      username: user.username || "",
      phoneNumber: user.phoneNumber || "",
      gender: user.gender || "",
      birthDate: user.birthDate || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteUserById(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      Swal.fire('Deleted!', 'User has been deleted.', 'success');
    } catch (err) {
      console.error("Delete failed:", err);
      Swal.fire("Error!", "Failed to delete user.", "error");
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        id: form.id,
        lastName: form.lastName,
        firstName: form.firstName,
        username: form.username,
        phoneNumber: form.phoneNumber,
        email: form.email,
        gender: form.gender,
        birthDate: form.birthDate,
      };

      const updated = await updateUser(payload, file);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setEditing(null);
      setFile(null);

      Swal.fire({
        title: "Success!",
        text: "User information has been updated.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire("Error!", "Update failed.", "error");
    }
  };

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.active === "ACTIVE").length,
    inactiveUsers: users.filter(u => u.active === "INACTIVE").length,
    adminUsers: users.filter(u => u.primaryRole === "ADMIN" || u.roles?.includes("ADMIN")).length,
    shopOwners: users.filter(u => u.primaryRole === "SHOP_OWNER" || u.roles?.includes("SHOP_OWNER")).length,
    regularUsers: users.filter(u => u.primaryRole === "USER").length,
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ADMIN": return "badge-danger";
      case "SHOP_OWNER": return "badge-warning";
      case "USER": return "badge-info";
      default: return "badge-secondary";
    }
  };

  return (
    <div className="user-management-page">
      {/* Header
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage all users and their permissions</p>
        </div>
      </div> */}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-total">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Users</span>
            <h2 className="stat-value">{stats.totalUsers}</h2>
            <span className="stat-sublabel">All registered users</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-active">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Users</span>
            <h2 className="stat-value">{stats.activeUsers}</h2>
            <span className="stat-sublabel">{((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of total</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-shop">
            <i className="fas fa-store"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Shop Owners</span>
            <h2 className="stat-value">{stats.shopOwners}</h2>
            <span className="stat-sublabel">Verified sellers</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-admin">
            <i className="fas fa-user-shield"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Administrators</span>
            <h2 className="stat-value">{stats.adminUsers}</h2>
            <span className="stat-sublabel">System admins</span>
          </div>
        </div>
      </div>

      {/* User Table Card */}
      <div className="card users-table-card">
        <div className="card-header">
          <h3 className="card-title">All Users</h3>
          <div className="header-actions">
            {/* Search */}
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Filters */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="SHOP_OWNER">Shop Owner</option>
              <option value="USER">User</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info-cell">
                          <div className="user-avatar">
                            {user.imageUrl ? (
                              <img src={user.imageUrl} alt={user.username} />
                            ) : (
                              <span>{(user.firstName?.[0] || user.username?.[0] || 'U').toUpperCase()}</span>
                            )}
                          </div>
                          <div className="user-details">
                            <span className="user-name">
                              {user.firstName} {user.lastName}
                            </span>
                            <span className="user-username">@{user.username}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="user-email">{user.email}</span>
                      </td>
                      <td>{user.phoneNumber || '-'}</td>
                      <td>
                        <span className={`role-badge ${getRoleBadgeColor(user.primaryRole)}`}>
                          {user.primaryRole}
                        </span>
                        {user.roles && user.roles.length > 1 && (
                          <span className="role-badge badge-secondary">+{user.roles.length - 1}</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${user.active === "ACTIVE" ? 'status-active' : 'status-inactive'}`}>
                          {user.active === "ACTIVE" ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(user)}
                            className="btn-action btn-edit"
                            title="Edit User"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => confirmDelete(user.id)}
                            className="btn-action btn-delete"
                            title="Delete User"
                            disabled={deletingId === user.id}
                          >
                            {deletingId === user.id ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              <i className="fas fa-trash"></i>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      <i className="fas fa-inbox"></i>
                      <p>No users found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Info */}
          <div className="table-footer">
            <span className="results-info">
              Showing {filteredUsers.length} of {users.length} users
            </span>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit User Details</h3>
              <button className="modal-close" onClick={() => setEditing(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={form.email}
                    readOnly
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select
                    className="form-input"
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Birth Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.birthDate}
                    onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Avatar</label>
                  <input
                    type="file"
                    className="form-input"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleSave}>
                <i className="fas fa-save"></i> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTablesPage;
