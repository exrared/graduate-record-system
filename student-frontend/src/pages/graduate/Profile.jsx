import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Calendar, BookOpen, 
  GraduationCap, Award, Save, Edit2, Camera, 
  Globe, Church, Home, Building, CheckCircle, AlertCircle,
  CreditCard, Briefcase, Heart, Upload, X, Hash,
  ArrowLeft
} from 'lucide-react';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import Skeleton from '../../components/Skeleton';
import { useAuth } from '../../contexts/AuthContext';
import { useGraduateProfile, useUpdateProfile, useProfileCompletion } from '../../hooks/useGraduateData';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: profileData, isLoading: profileLoading, refetch } = useGraduateProfile();
  const { data: completionData, isLoading: completionLoading } = useProfileCompletion();
  const updateProfile = useUpdateProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Helper function to format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  // Generate school year options (2020-2021 to current year + 1)
  const currentYear = new Date().getFullYear();
  const schoolYearOptions = [];
  for (let year = 2020; year <= currentYear + 1; year++) {
    schoolYearOptions.push(`${year}-${year + 1}`);
  }

  // Course options
  const courseOptions = [
    'BS Criminology',
    'BS Education',
    'BS Information Technology',
    'BS Political Science',
    'BS Business Administration',
    'BS Office Administration',
    'BS Accountancy',
    'BS Psychology',
    'BS Social Work',
    'BS Architecture',
    'BS Nursing',
    'BS Computer Science'
  ];

  // Department options based on course selection
  const getDepartmentOptions = (course) => {
    const departmentMap = {
      'BS Criminology': 'College of Criminal Justice Education',
      'BS Education': 'College of Education',
      'BS Information Technology': 'College of Computing and Information Sciences',
      'BS Political Science': 'College of Arts and Sciences',
      'BS Business Administration': 'College of Business and Accountancy',
      'BS Office Administration': 'College of Business and Accountancy',
      'BS Accountancy': 'College of Business and Accountancy',
      'BS Psychology': 'College of Arts and Sciences',
      'BS Social Work': 'College of Arts and Sciences',
      'BS Architecture': 'College of Engineering and Architecture',
      'BS Nursing': 'College of Health Sciences',
      'BS Computer Science': 'College of Computing and Information Sciences'
    };
    return departmentMap[course] || 'Select department';
  };

  // All department options for dropdown
  const departmentOptions = [
    'College of Criminal Justice Education',
    'College of Education',
    'College of Computing and Information Sciences',
    'College of Arts and Sciences',
    'College of Business and Accountancy',
    'College of Engineering and Architecture',
    'College of Health Sciences',
    'College of Law',
    'Graduate School'
  ];

  // Dropdown options
  const nationalityOptions = [
    'Filipino', 'American', 'British', 'Canadian', 'Australian', 
    'Japanese', 'Chinese', 'Korean', 'Indian', 'German', 
    'French', 'Spanish', 'Italian', 'Other'
  ];

  const religionOptions = [
    'Roman Catholic', 'Christian', 'Islam', 'Iglesia ni Cristo', 
    'Born Again Christian', 'Seventh-day Adventist', 'Buddhist', 
    'Hindu', 'Jewish', 'Atheist', 'Agnostic', 'Other'
  ];

  const civilStatusOptions = [
    'Single', 'Married', 'Divorced', 'Widowed', 'Separated'
  ];

  const genderOptions = ['Male', 'Female'];

  const suffixOptions = ['', 'Jr.', 'Sr.', 'III', 'IV', 'V'];

  const honorOptions = [
    '', 'Summa Cum Laude', 'Magna Cum Laude', 'Cum Laude', 
    'Honorable Mention', 'Dean\'s Lister', 'President\'s Lister', 'Other'
  ];

  // Initialize form data when profile loads
  useEffect(() => {
    if (profileData) {
      setFormData({
        student_id: profileData.student_id || '',
        firstname: profileData.firstname || '',
        middlename: profileData.middlename || '',
        lastname: profileData.lastname || '',
        suffix: profileData.suffix || '',
        gender: profileData.gender || '',
        birthdate: formatDateForInput(profileData.birthdate),
        place_of_birth: profileData.place_of_birth || '',
        civil_status: profileData.civil_status || '',
        nationality: profileData.nationality || '',
        religion: profileData.religion || '',
        address: profileData.address || '',
        city: profileData.city || '',
        province: profileData.province || '',
        postal_code: profileData.postal_code || '',
        contact_number: profileData.contact_number || '',
        email: profileData.email || user?.email || '',
        course: profileData.course || '',
        department: profileData.department || '',
        year_graduated: profileData.year_graduated || '',
        honors: profileData.honors || '',
      });
    }
  }, [profileData, user]);

  // Auto-set department when course changes
  useEffect(() => {
    if (formData.course && isEditing) {
      const suggestedDept = getDepartmentOptions(formData.course);
      if (suggestedDept !== 'Select department' && !formData.department) {
        setFormData(prev => ({ ...prev, department: suggestedDept }));
      }
    }
  }, [formData.course, isEditing]);

  const completionPercentage = completionData?.percentage || 0;
  const isProfileComplete = completionPercentage === 100;

  // Validation functions
  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'firstname':
        if (!value?.trim()) error = 'First name is required';
        break;
      case 'lastname':
        if (!value?.trim()) error = 'Last name is required';
        break;
      case 'student_id':
        if (!value?.trim()) error = 'Student ID is required';
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Valid email is required';
        }
        break;
      case 'contact_number':
        if (value && !/^[0-9+\-\s()]{10,15}$/.test(value)) {
          error = 'Valid contact number is required';
        }
        break;
      case 'postal_code':
        if (value && (value < 0 || value > 9999)) {
          error = 'Postal code must be between 0 and 9999';
        }
        break;
      case 'course':
        if (!value) error = 'Course is required';
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFieldBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (profilePicture) {
        formDataToSend.append('profile_picture', profilePicture);
      }

      await updateProfile.mutateAsync(formDataToSend);
      
      setToast({
        isOpen: true,
        message: 'Profile updated successfully!',
        type: 'success',
      });
      setIsEditing(false);
      setProfilePicture(null);
      setPreviewUrl(null);
      refetch();
    } catch (error) {
      setToast({
        isOpen: true,
        message: error.response?.data?.message || 'Failed to update profile',
        type: 'error',
      });
    }
  };

  const isLoading = profileLoading || completionLoading;

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton variant="title" className="h-8 w-48" />
          <Skeleton variant="button" className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Skeleton variant="card" className="h-96" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton variant="card" className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group mb-2"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Dashboard</span>
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            View and manage your personal information
          </p>
        </div>
        <div className="flex gap-3">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="primary">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button onClick={() => setIsEditing(false)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleSave} variant="primary" disabled={updateProfile.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Profile Completion Banner */}
      <div className={`rounded-lg p-4 border ${
        isProfileComplete 
          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
          : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            {isProfileComplete ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            )}
            <div>
              <p className="font-semibold">
                Profile {completionPercentage}% Complete
              </p>
              <p className="text-sm">
                {isProfileComplete 
                  ? 'Your profile is complete! You can now request documents.'
                  : 'Complete your profile to request documents'}
              </p>
              {!isProfileComplete && completionData?.missingFields && (
                <ul className="mt-2 text-xs text-yellow-700 dark:text-yellow-400 list-disc list-inside">
                  {completionData.missingFields.map((field, index) => (
                    <li key={index}>{field}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="w-full sm:w-48 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${isProfileComplete ? 'bg-green-600' : 'bg-yellow-600'}`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Picture & Basic Info */}
        <div className="space-y-6">
          {/* Profile Picture Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto">
                  {/* CHANGED: Use profile_picture_url instead of profile_picture */}
                  {previewUrl || profileData?.profile_picture_url ? (
                    <img 
                      src={previewUrl || profileData.profile_picture_url} 
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {formData.firstname?.[0]}{formData.lastname?.[0]}
                    </span>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-700 transition">
                    <Camera className="w-4 h-4 text-white" />
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                {formData.firstname} {formData.lastname}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">{formData.student_id}</p>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">{formData.course}</p>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Student ID</span>
                <span className="font-medium">{formData.student_id || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Course</span>
                <span className="font-medium">{formData.course || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Department</span>
                <span className="font-medium">{formData.department || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Year Graduated</span>
                <span className="font-medium">{formData.year_graduated || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Honors</span>
                <span className="font-medium">{formData.honors || 'None'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Student ID */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Student ID * <span className="text-xs text-gray-500">(e.g., 2020-12345)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.student_id || ''}
                    onChange={(e) => handleFieldChange('student_id', e.target.value)}
                    onBlur={() => handleFieldBlur('student_id')}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 
                               text-gray-900 dark:text-white focus:outline-none focus:ring-2 
                               focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800
                               ${errors.student_id && touched.student_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    placeholder="e.g., 2020-12345"
                  />
                  {errors.student_id && touched.student_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.student_id}</p>
                  )}
                </div>
                
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstname || ''}
                    onChange={(e) => handleFieldChange('firstname', e.target.value)}
                    onBlur={() => handleFieldBlur('firstname')}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 
                               text-gray-900 dark:text-white focus:outline-none focus:ring-2 
                               focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800
                               ${errors.firstname && touched.firstname ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  />
                  {errors.firstname && touched.firstname && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>
                  )}
                </div>
                
                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastname || ''}
                    onChange={(e) => handleFieldChange('lastname', e.target.value)}
                    onBlur={() => handleFieldBlur('lastname')}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none 
                             focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                
                {/* Middle Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={formData.middlename || ''}
                    onChange={(e) => handleFieldChange('middlename', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none 
                             focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                
                {/* Suffix */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Suffix
                  </label>
                  <select
                    value={formData.suffix || ''}
                    onChange={(e) => handleFieldChange('suffix', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none 
                             focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  >
                    {suffixOptions.map((suffix) => (
                      <option key={suffix || 'none'} value={suffix}>{suffix || 'None'}</option>
                    ))}
                  </select>
                </div>
                
                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gender *
                  </label>
                  <select
                    value={formData.gender || ''}
                    onChange={(e) => handleFieldChange('gender', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none 
                             focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  >
                    <option value="">Select Gender</option>
                    {genderOptions.map((gender) => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                </div>
                
                {/* Civil Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Civil Status *
                  </label>
                  <select
                    value={formData.civil_status || ''}
                    onChange={(e) => handleFieldChange('civil_status', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none 
                             focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  >
                    <option value="">Select Status</option>
                    {civilStatusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                
                {/* Birthdate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Birthdate *
                  </label>
                  <input
                    type="date"
                    value={formData.birthdate || ''}
                    onChange={(e) => handleFieldChange('birthdate', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none 
                             focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                
                {/* Place of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Place of Birth
                  </label>
                  <input
                    type="text"
                    value={formData.place_of_birth || ''}
                    onChange={(e) => handleFieldChange('place_of_birth', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none 
                             focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                
                {/* Nationality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nationality
                  </label>
                  <select
                    value={formData.nationality || ''}
                    onChange={(e) => handleFieldChange('nationality', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none 
                             focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  >
                    <option value="">Select Nationality</option>
                    {nationalityOptions.map((nationality) => (
                      <option key={nationality} value={nationality}>{nationality}</option>
                    ))}
                  </select>
                </div>
                
                {/* Religion */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Religion
                  </label>
                  <select
                    value={formData.religion || ''}
                    onChange={(e) => handleFieldChange('religion', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none 
                             focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  >
                    <option value="">Select Religion</option>
                    {religionOptions.map((religion) => (
                      <option key={religion} value={religion}>{religion}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.contact_number || ''}
                    onChange={(e) => handleFieldChange('contact_number', e.target.value)}
                    onBlur={() => handleFieldBlur('contact_number')}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 
                               text-gray-900 dark:text-white focus:outline-none focus:ring-2 
                               focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800
                               ${errors.contact_number && touched.contact_number ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    placeholder="0912 345 6789"
                  />
                  {errors.contact_number && touched.contact_number && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact_number}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={() => handleFieldBlur('email')}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 
                               text-gray-900 dark:text-white focus:outline-none focus:ring-2 
                               focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800
                               ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Address Information
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none 
                             focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City/Municipality *
                  </label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none 
                             focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Province
                  </label>
                  <input
                    type="text"
                    value={formData.province || ''}
                    onChange={(e) => handleFieldChange('province', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none 
                             focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.postal_code || ''}
                    onChange={(e) => handleFieldChange('postal_code', parseInt(e.target.value) || 0)}
                    onBlur={() => handleFieldBlur('postal_code')}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 
                               text-gray-900 dark:text-white focus:outline-none focus:ring-2 
                               focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800
                               ${errors.postal_code && touched.postal_code ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    placeholder="e.g., 1000"
                  />
                  {errors.postal_code && touched.postal_code && (
                    <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Academic Information
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Course Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Course/Degree *
                  </label>
                  <select
                    value={formData.course || ''}
                    onChange={(e) => handleFieldChange('course', e.target.value)}
                    onBlur={() => handleFieldBlur('course')}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 
                               text-gray-900 dark:text-white focus:outline-none focus:ring-2 
                               focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800
                               ${errors.course && touched.course ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  >
                    <option value="">Select Course</option>
                    {courseOptions.map((course) => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                  {errors.course && touched.course && (
                    <p className="mt-1 text-sm text-red-600">{errors.course}</p>
                  )}
                </div>
                
                {/* Department Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department || ''}
                    onChange={(e) => handleFieldChange('department', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none 
                             focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  >
                    <option value="">Select Department</option>
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                {/* Year Graduated - SCHOOL YEAR DROPDOWN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Year Graduated * <span className="text-xs text-gray-500">(School Year)</span>
                  </label>
                  <select
                    value={formData.year_graduated || ''}
                    onChange={(e) => handleFieldChange('year_graduated', e.target.value)}
                    onBlur={() => handleFieldBlur('year_graduated')}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 
                               text-gray-900 dark:text-white focus:outline-none focus:ring-2 
                               focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800
                               ${errors.year_graduated && touched.year_graduated ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  >
                    <option value="">Select School Year</option>
                    {schoolYearOptions.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.year_graduated && touched.year_graduated && (
                    <p className="mt-1 text-sm text-red-600">{errors.year_graduated}</p>
                  )}
                </div>
                
                {/* Honors Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Honors/Awards
                  </label>
                  <select
                    value={formData.honors || ''}
                    onChange={(e) => handleFieldChange('honors', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none 
                             focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  >
                    {honorOptions.map((honor) => (
                      <option key={honor || 'none'} value={honor}>{honor || 'None'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
};

export default Profile;