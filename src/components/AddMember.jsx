import React, { useState, useEffect } from 'react'
import { useFamily } from '../context/FamilyContext'
import { useNavigate } from 'react-router-dom'

const AddMember = () => {
  const { addFamilyMember, familyMembers } = useFamily()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    parents: [],
    spouse: null
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleParentsChange = (e) => {
    const selectedParents = Array.from(e.target.selectedOptions, option => Number(option.value))
    setFormData(prev => ({
      ...prev,
      parents: selectedParents
    }))
  }

  const handleSpouseChange = (e) => {
    const spouseId = e.target.value ? Number(e.target.value) : null
    setFormData(prev => ({
      ...prev,
      spouse: spouseId
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name || !formData.age) {
      alert('Please fill in all required fields')
      return
    }

    try {
      // Convert age to number
      const memberData = {
        ...formData,
        age: Number(formData.age)
      }

      // Add the new member
      await addFamilyMember(memberData)

      // Reset form
      setFormData({
        name: '',
        age: '',
        gender: 'male',
        parents: [],
        spouse: null
      })

      // Navigate to family tree page
      navigate('/family-tree')
    } catch (error) {
      console.error('Error adding family member:', error)
      alert('Failed to add family member. Please try again.')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Family Member</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Age *</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {familyMembers.length > 0 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Parents</label>
              <select
                multiple
                value={formData.parents}
                onChange={handleParentsChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Parents</option>
                {familyMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple parents</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Spouse</label>
              <select
                value={formData.spouse || ''}
                onChange={handleSpouseChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Spouse</option>
                {familyMembers
                  .filter(member => member.gender !== formData.gender)
                  .map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
              </select>
            </div>
          </>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/family-tree')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Member
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddMember 