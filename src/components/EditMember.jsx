import React, { useState, useEffect } from 'react'
import { useFamily } from '../context/FamilyContext'
import { useNavigate, useParams } from 'react-router-dom'

const EditMember = () => {
  const { familyMembers, updateRelationships } = useFamily()
  const navigate = useNavigate()
  const { id } = useParams()
  const memberId = Number(id)

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    parents: [],
    spouse: null
  })

  useEffect(() => {
    const member = familyMembers.find(m => m.id === memberId)
    if (member) {
      setFormData({
        name: member.name,
        age: member.age,
        gender: member.gender,
        parents: member.parents || [],
        spouse: member.spouse
      })
    } else {
      navigate('/')
    }
  }, [memberId, familyMembers, navigate])

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

      // Update the member
      updateRelationships(memberId, memberData)

      // Navigate to family tree page
      navigate('/')
    } catch (error) {
      console.error('Error updating family member:', error)
      alert('Failed to update family member. Please try again.')
    }
  }

  return (
    <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-center">Edit Family Member</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {familyMembers
                  .filter(member => member.id !== memberId)
                  .map(member => (
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
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Spouse</option>
                {familyMembers
                  .filter(member => member.id !== memberId && member.gender !== formData.gender)
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
            onClick={() => navigate('/')}
            className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditMember 