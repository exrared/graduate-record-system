import { useState, useMemo, useEffect } from 'react'
import Table from '../components/Table'
import Modal from '../components/Modal'
import Button from '../components/Button'
import Pagination from '../components/Pagination'
import Toast from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'
import SkeletonTable from '../components/SkeletonTable'
import Skeleton from '../components/Skeleton'
import { Plus, Edit2 } from 'lucide-react'

const Students = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for 1 second
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Student data - directly structured
  const parseStudentData = () => {
    const studentData = [
      { studentId: '24-019536', lastName: 'ALVIZ', firstName: 'BRELIAN JAY', middleInitial: 'D', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '24-021241', lastName: 'ARAMBALA', firstName: 'LORVINCENT', middleInitial: 'C', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '24-018918', lastName: 'AVANZADO', firstName: 'GENE CARL', middleInitial: 'K', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '24-018835', lastName: 'BARIL', firstName: 'LEONARDO', middleInitial: 'P', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '24-018803', lastName: 'CAGANDE', firstName: 'LOU GENRICK', middleInitial: '', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '24-008841', lastName: 'CATURZA', firstName: 'MARK ANGEL', middleInitial: 'M', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '24-019553', lastName: 'CUTAMORA', firstName: 'MANNY', middleInitial: 'H', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '24-018936', lastName: 'DECLARO', firstName: 'JONNIEL', middleInitial: 'A', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '24-020309', lastName: 'GARCIA', firstName: 'JOSHUA GABRIEL', middleInitial: '', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '24-018847', lastName: 'GURREA', firstName: 'VHANNE ALLEN', middleInitial: 'C', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '24-019399', lastName: 'LORETO', firstName: 'JAMES HAROLD', middleInitial: 'E', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '24-018794', lastName: 'MAGNO', firstName: 'JOHN FLORENCE', middleInitial: 'P', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '24-019297', lastName: 'MALIGAT', firstName: 'JUSTINE', middleInitial: 'F', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '24-019340', lastName: 'MARTINEZ', firstName: 'JHON MARK', middleInitial: 'P', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '24-018781', lastName: 'OPONDA', firstName: 'ARJHAY', middleInitial: 'R', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '24-018767', lastName: 'PATIGAYON', firstName: 'RJ DANIEL', middleInitial: 'J', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '20-010675', lastName: 'PERA', firstName: 'KIM', middleInitial: 'C', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '24-019574', lastName: 'RADANA', firstName: 'BLAREWIND', middleInitial: 'B', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '24-018780', lastName: 'ROQUIERO', firstName: 'JOSEPH', middleInitial: 'T', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '24-019378', lastName: 'ROSALES', firstName: 'JOSEPH', middleInitial: 'T', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '24-019014', lastName: 'TENIO', firstName: 'JHON PHILLIP', middleInitial: 'B', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '24-019564', lastName: 'TUYOR', firstName: 'KENNETH JIM', middleInitial: 'C', course: 'BSIT - 2', gender: 'Male' },
      { studentId: '24-019835', lastName: 'ANIÑON', firstName: 'CHARELLE', middleInitial: 'M', course: 'BSIT - 2', gender: 'Female' },
      { studentId: '24-018859', lastName: 'BOYONAS', firstName: 'JUANA MARIE', middleInitial: 'R', course: 'BSIT - 2', gender: 'Female' },
      { studentId: '24-018810', lastName: 'BULLANDAY', firstName: 'JENALEE', middleInitial: 'S', course: 'BSIT - 2', gender: 'Female' },
      { studentId: '24-019560', lastName: 'DEBALUCOS', firstName: 'KRISTINE', middleInitial: 'D', course: 'BSIT - 2', gender: 'Female' },
      { studentId: '24-018787', lastName: 'DEGAMON', firstName: 'EDEN JOY', middleInitial: '', course: 'BSIT - 2', gender: 'Female' },
      { studentId: '24-018834', lastName: 'ENERO', firstName: 'MAE', middleInitial: 'G', course: 'BSIT - 2', gender: 'Female' },
      { studentId: '24-021212', lastName: 'FUROG', firstName: 'CHERRY MAE', middleInitial: 'G', course: 'BSIT - 2', gender: 'Female' },
      { studentId: '24-018772', lastName: 'GAVAS', firstName: 'THIA ISABELA', middleInitial: 'E', course: 'BSIT - 2', gender: 'Female' },
      { studentId: '24-018824', lastName: 'JAMIL', firstName: 'ARGELENE', middleInitial: 'C', course: 'BSIT - 2', gender: 'Female' },
      { studentId: '24-018925', lastName: 'LAZAGA', firstName: 'ALYSSA KELSEA', middleInitial: 'T', course: 'BSIT - 2', gender: 'Female' },
      { studentId: '24-018855', lastName: 'LICAYAN', firstName: 'WINA JEIANME', middleInitial: 'T', course: 'BSIT - 2', gender: 'Female' },
      { studentId: '24-021238', lastName: 'MAGTOTO', firstName: 'JANE CHINKEE', middleInitial: 'A', course: 'BSIT - 2', gender: 'Female' },
      { studentId: '24-019575', lastName: 'OPALLA', firstName: 'JHOLEIN', middleInitial: '', course: 'BSIT - 2', gender: 'Female' },
      { studentId: '24-019225', lastName: 'PELECIO', firstName: 'ROCHELLE MAE', middleInitial: 'H', course: 'BSIT - 2', gender: 'Female' },
      { studentId: '24-018871', lastName: 'SALINGAY', firstName: 'KIMBERLY', middleInitial: 'A', course: 'BSIT - 2', gender: 'Female' },
      { studentId: '24-018807', lastName: 'SUCUANO', firstName: 'CINDY MAE', middleInitial: 'C', course: 'BSIT - 2', gender: 'Female' },
      { studentId: '24-018890', lastName: 'SUMALINOG', firstName: 'JELYN', middleInitial: 'M', course: 'BSIT - 2', gender: 'Female' },
      { studentId: '24-021198', lastName: 'VILLAMOR', firstName: 'LORYLYN', middleInitial: 'N', course: 'BSIT - 2', gender: 'Female' },
    ]

    return studentData.map((student, index) => {
      // Construct full name
      const fullName = `${student.firstName} ${student.middleInitial ? student.middleInitial + '.' : ''} ${student.lastName}`.trim()
      
      return {
        id: index + 1,
        studentId: student.studentId,
        images: 'IMAGE',
        lastName: student.lastName,
        firstName: student.firstName,
        middleInitial: student.middleInitial,
        fullName,
        course: student.course,
        gender: student.gender,
        status: 'active',
      }
    })
  }

  const [allData, setAllData] = useState(parseStudentData())

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({ 
    studentId: '', 
    lastName: '', 
    firstName: '', 
    middleInitial: '', 
    course: '', 
    gender: '' 
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Form validation errors
  const [errors, setErrors] = useState({ 
    studentId: '', 
    lastName: '', 
    firstName: '', 
    course: '', 
    gender: '' 
  })
  const [touched, setTouched] = useState({ 
    studentId: false, 
    lastName: false, 
    firstName: false, 
    course: false, 
    gender: false 
  })
  
  // Toast state
  const [toast, setToast] = useState({
    isOpen: false,
    message: '',
    type: 'success',
  })

  // Confirm Dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    item: null,
    newStatus: null,
  })

  const columns = [
    { key: 'studentId', label: 'STUDENT_ID', width: '1%' },
    { 
      key: 'images', 
      label: 'IMAGES',
      width: '1%',
      render: (value, item) => {
        const initial = item.firstName ? item.firstName.charAt(0).toUpperCase() : '?'
        // Generate a color based on the name for consistency
        const colors = [
          'bg-blue-500',
          'bg-green-500',
          'bg-purple-500',
          'bg-pink-500',
          'bg-indigo-500',
          'bg-yellow-500',
          'bg-red-500',
          'bg-teal-500',
        ]
        const colorIndex = item.firstName ? item.firstName.charCodeAt(0) % colors.length : 0
        const bgColor = colors[colorIndex]
        
        return (
          <div className="flex items-center justify-center">
            <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center text-white font-semibold`}>
              {initial}
            </div>
          </div>
        )
      }
    },
    { key: 'lastName', label: 'LASTNAME' },
    { key: 'firstName', label: 'FIRSTNAME' },
    { 
      key: 'middleInitial', 
      label: 'MIDDLE INITIAL',
      render: (value) => value || '-'
    },
    { key: 'course', label: 'COURSE & YEAR' },
    { 
      key: 'gender', 
      label: 'GENDER',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Male' 
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
            : 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
        }`}>
          {value}
        </span>
      )
    },
  ]

  // Validation functions
  const validateStudentId = (studentId) => {
    if (!studentId.trim()) {
      return 'Student ID is required'
    }
    return ''
  }

  const validateLastName = (lastName) => {
    if (!lastName.trim()) {
      return 'Last name is required'
    }
    return ''
  }

  const validateFirstName = (firstName) => {
    if (!firstName.trim()) {
      return 'First name is required'
    }
    return ''
  }

  const validateCourse = (course) => {
    if (!course.trim()) {
      return 'Course is required'
    }
    return ''
  }

  const validateGender = (gender) => {
    if (!gender) {
      return 'Gender is required'
    }
    return ''
  }

  const validateField = (field, value) => {
    let error = ''
    switch (field) {
      case 'studentId':
        error = validateStudentId(value)
        break
      case 'lastName':
        error = validateLastName(value)
        break
      case 'firstName':
        error = validateFirstName(value)
        break
      case 'course':
        error = validateCourse(value)
        break
      case 'gender':
        error = validateGender(value)
        break
      default:
        break
    }
    setErrors((prev) => ({ ...prev, [field]: error }))
    return error === ''
  }

  const validateForm = () => {
    const studentIdValid = validateField('studentId', formData.studentId)
    const lastNameValid = validateField('lastName', formData.lastName)
    const firstNameValid = validateField('firstName', formData.firstName)
    const courseValid = validateField('course', formData.course)
    const genderValid = validateField('gender', formData.gender)
    
    setTouched({ 
      studentId: true, 
      lastName: true, 
      firstName: true, 
      course: true, 
      gender: true 
    })
    
    return studentIdValid && lastNameValid && firstNameValid && courseValid && genderValid
  }

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleFieldBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateField(field, formData[field])
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({ 
      studentId: item.studentId, 
      lastName: item.lastName, 
      firstName: item.firstName, 
      middleInitial: item.middleInitial || '', 
      course: item.course, 
      gender: item.gender 
    })
    setErrors({ studentId: '', lastName: '', firstName: '', course: '', gender: '' })
    setTouched({ studentId: false, lastName: false, firstName: false, course: false, gender: false })
    setIsModalOpen(true)
  }

  // Filter and paginate data
  const filteredData = useMemo(() => {
    if (!searchQuery) return allData
    
    const query = searchQuery.toLowerCase()
    return allData.filter((item) =>
      item.studentId.toLowerCase().includes(query) ||
      item.fullName.toLowerCase().includes(query) ||
      item.lastName.toLowerCase().includes(query) ||
      item.firstName.toLowerCase().includes(query) ||
      item.course.toLowerCase().includes(query) ||
      item.gender.toLowerCase().includes(query)
    )
  }, [allData, searchQuery])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, currentPage, pageSize])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  const showToast = (message, type = 'success') => {
    setToast({ isOpen: true, message, type })
  }

  const handleStatusChange = (item, newStatus) => {
    // Show confirmation dialog
    setConfirmDialog({
      isOpen: true,
      item: item,
      newStatus: newStatus,
    })
  }

  const confirmStatusChange = () => {
    const { item, newStatus } = confirmDialog
    if (item && newStatus) {
      setAllData(allData.map((d) => d.id === item.id ? { ...d, status: newStatus } : d))
      const statusText = newStatus === 'active' ? 'active' : 'inactive'
      showToast(`${item.fullName} has been set to ${statusText}`, 'success')
    }
  }

  const handleSave = () => {
    // Validate form
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error')
      return
    }

    try {
      if (editingItem) {
        const updatedItem = {
          ...editingItem,
          studentId: formData.studentId,
          lastName: formData.lastName,
          firstName: formData.firstName,
          middleInitial: formData.middleInitial,
          course: formData.course,
          gender: formData.gender,
          fullName: `${formData.firstName} ${formData.middleInitial ? formData.middleInitial + '.' : ''} ${formData.lastName}`.trim(),
        }
        setAllData(allData.map((d) => 
          d.id === editingItem.id ? updatedItem : d
        ))
        showToast('Student updated successfully', 'success')
      } else {
        const newItem = {
          id: Math.max(...allData.map(d => d.id), 0) + 1,
          studentId: formData.studentId,
          lastName: formData.lastName,
          firstName: formData.firstName,
          middleInitial: formData.middleInitial,
          course: formData.course,
          gender: formData.gender,
          fullName: `${formData.firstName} ${formData.middleInitial ? formData.middleInitial + '.' : ''} ${formData.lastName}`.trim(),
          status: 'active'
        }
        setAllData([...allData, newItem])
        showToast('Student created successfully', 'success')
      }
      setIsModalOpen(false)
      setEditingItem(null)
      setFormData({ studentId: '', lastName: '', firstName: '', middleInitial: '', course: '', gender: '' })
      setErrors({ studentId: '', lastName: '', firstName: '', course: '', gender: '' })
      setTouched({ studentId: false, lastName: false, firstName: false, course: false, gender: false })
    } catch (error) {
      showToast('An error occurred. Please try again.', 'error')
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when page size changes
  }

  const handleSearchChange = (query) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page when search changes
  }

  const handleAddNew = () => {
    setEditingItem(null)
    setFormData({ studentId: '', lastName: '', firstName: '', middleInitial: '', course: '', gender: '' })
    setErrors({ studentId: '', lastName: '', firstName: '', course: '', gender: '' })
    setTouched({ studentId: false, lastName: false, firstName: false, course: false, gender: false })
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Skeleton variant="title" className="h-8 w-32 mb-2" />
            <Skeleton variant="text" className="h-4 w-64" />
          </div>
          <Skeleton variant="button" className="w-32 h-10" />
        </div>

        {/* Skeleton Pagination */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Skeleton variant="text" className="h-4 w-32" />
              <Skeleton variant="text" className="h-4 w-48" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton variant="text" className="h-10 w-96" />
              <Skeleton variant="text" className="h-10 w-48" />
            </div>
          </div>
        </div>

        <SkeletonTable rows={10} columns={6} />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Students
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Manage student records and information
          </p>
        </div>
        <Button onClick={handleAddNew} variant="primary" className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2 inline" />
          Add New
        </Button>
      </div>

      {/* Pagination - Top */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={filteredData.length}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        showSearch={true}
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by student ID, name, course, or gender..."
      />

      <Table
        data={paginatedData}
        columns={columns}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
      />

      {/* Pagination - Bottom */}
      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredData.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          showSearch={false}
        />
      )}

      {/* Toast Notification */}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />

      {/* Confirm Dialog - Status Change */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, item: null, newStatus: null })}
        onConfirm={confirmStatusChange}
        title="Confirm Status Change"
        message={`Sigurado ba na ${confirmDialog.newStatus === 'active' ? 'Active' : 'Inactive'} mo itong student na ${confirmDialog.item?.fullName}?`}
        confirmText="Confirm"
        cancelText="Cancel"
        type="warning"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingItem(null)
          setFormData({ studentId: '', lastName: '', firstName: '', middleInitial: '', course: '', gender: '' })
          setErrors({ studentId: '', lastName: '', firstName: '', course: '', gender: '' })
          setTouched({ studentId: false, lastName: false, firstName: false, course: false, gender: false })
        }}
        title={editingItem ? 'Edit Student' : 'Add New Student'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Student ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.studentId}
              onChange={(e) => handleFieldChange('studentId', e.target.value)}
              onBlur={() => handleFieldBlur('studentId')}
              className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                touched.studentId && errors.studentId
                  ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Enter student ID (e.g., 24-019536)"
            />
            {touched.studentId && errors.studentId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.studentId}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              onBlur={() => handleFieldBlur('lastName')}
              className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                touched.lastName && errors.lastName
                  ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Enter last name"
            />
            {touched.lastName && errors.lastName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lastName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              onBlur={() => handleFieldBlur('firstName')}
              className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                touched.firstName && errors.firstName
                  ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Enter first name"
            />
            {touched.firstName && errors.firstName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Middle Initial
            </label>
            <input
              type="text"
              value={formData.middleInitial}
              onChange={(e) => handleFieldChange('middleInitial', e.target.value.toUpperCase())}
              maxLength={1}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter middle initial"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Course <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) => handleFieldChange('course', e.target.value)}
              onBlur={() => handleFieldBlur('course')}
              className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                touched.course && errors.course
                  ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Enter course (e.g., BSIT - 2)"
            />
            {touched.course && errors.course && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.course}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleFieldChange('gender', e.target.value)}
              onBlur={() => handleFieldBlur('gender')}
              className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                touched.gender && errors.gender
                  ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
              }`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {touched.gender && errors.gender && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.gender}</p>
            )}
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false)
                setEditingItem(null)
                setFormData({ studentId: '', lastName: '', firstName: '', middleInitial: '', course: '', gender: '' })
                setErrors({ studentId: '', lastName: '', firstName: '', course: '', gender: '' })
                setTouched({ studentId: false, lastName: false, firstName: false, course: false, gender: false })
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Students
