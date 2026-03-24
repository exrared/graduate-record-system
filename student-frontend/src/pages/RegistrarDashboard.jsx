import { FileText, Clock, CheckCircle } from "lucide-react"

const RegistrarDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"))

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Registrar Dashboard</h1>

      <p className="mb-6 text-gray-600">
        Welcome, {user?.name}. Manage graduate record requests here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white shadow-lg rounded-xl p-6">
          <FileText className="w-10 h-10 text-blue-500 mb-3"/>
          <h2 className="text-lg font-semibold">Total Requests</h2>
          <p className="text-gray-500">View all submitted requests</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <Clock className="w-10 h-10 text-yellow-500 mb-3"/>
          <h2 className="text-lg font-semibold">Pending Requests</h2>
          <p className="text-gray-500">Requests waiting for approval</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <CheckCircle className="w-10 h-10 text-green-500 mb-3"/>
          <h2 className="text-lg font-semibold">Completed Requests</h2>
          <p className="text-gray-500">Processed student records</p>
        </div>

      </div>
    </div>
  )
}

export default RegistrarDashboard