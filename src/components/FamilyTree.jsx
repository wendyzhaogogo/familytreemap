import React from 'react'
import { useFamily } from '../context/FamilyContext'
import FamilyTreeVisualization from './FamilyTreeVisualization'

const FamilyTree = () => {
  const { familyMembers } = useFamily()

  if (familyMembers.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center p-8 text-gray-600">
          <h2 className="text-2xl font-bold mb-2">No family members added yet</h2>
          <p>Add your first family member to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Family Tree</h2>
        <FamilyTreeVisualization />
      </div>
    </div>
  )
}

export default FamilyTree 