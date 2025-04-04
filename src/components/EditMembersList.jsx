import React from 'react'
import { useFamily } from '../context/FamilyContext'
import { useNavigate } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'

const EditMembersList = () => {
  const { familyMembers } = useFamily()
  const navigate = useNavigate()

  if (familyMembers.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center p-8 text-gray-600">
          <h2 className="text-2xl font-bold mb-2">No family members to edit</h2>
          <p>Add your first family member to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Family Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {familyMembers.map(member => (
          <div key={member.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-gray-600">Age: {member.age}</p>
                <p className="text-gray-600">Gender: {member.gender}</p>
                {member.parents && member.parents.length > 0 && (
                  <p className="text-gray-600">
                    Parents: {member.parents.map(id => {
                      const parent = familyMembers.find(m => m.id === id)
                      return parent ? parent.name : id
                    }).join(', ')}
                  </p>
                )}
                {member.spouse && (
                  <p className="text-gray-600">
                    Spouse: {familyMembers.find(m => m.id === member.spouse)?.name || member.spouse}
                  </p>
                )}
              </div>
              <button
                onClick={() => navigate(`/edit/${member.id}`)}
                className="p-2 text-indigo-600 hover:text-indigo-800"
                title="Edit member"
              >
                <FaEdit />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EditMembersList 