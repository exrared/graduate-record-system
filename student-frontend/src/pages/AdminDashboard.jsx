const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <p>Role: {user?.role}</p>
      
      {/* Admin-only features */}
      <div className="mt-4">
        <h2 className="font-semibold">Admin Controls:</h2>
        <ul>
          <li>Manage Users</li>
          <li>System Settings</li>
          <li>Reports</li>
        </ul>
      </div>
    </div>
  )
}

export default AdminDashboard