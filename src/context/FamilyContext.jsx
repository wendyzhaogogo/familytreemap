import React, { createContext, useContext, useState } from 'react'
import { toast } from 'react-toastify'

const FamilyContext = createContext()

export const FamilyProvider = ({ children }) => {
  // Mock data for preview
  const mockData = [
    {
      id: 1,
      name: 'John Smith',
      age: 50,
      gender: 'male',
      parents: [],
      spouse: 2,
      children: [3]
    },
    {
      id: 2,
      name: 'Mary Smith',
      age: 48,
      gender: 'female',
      parents: [],
      spouse: 1,
      children: [3]
    },
    {
      id: 3,
      name: 'Tom Smith',
      age: 20,
      gender: 'male',
      parents: [1, 2],
      spouse: null,
      children: []
    }
  ]

  const [familyMembers, setFamilyMembers] = useState(mockData)
  const [notifications, setNotifications] = useState([])

  const addFamilyMember = (member) => {
    const newMember = {
      ...member,
      id: Date.now(),
      children: [],
      parents: member.parents || [],
      spouse: member.spouse || null
    }

    const updatedMembers = familyMembers.map(existingMember => {
      if (newMember.parents.includes(existingMember.id)) {
        return {
          ...existingMember,
          children: [...existingMember.children, newMember.id]
        }
      }
      return existingMember
    })

    if (newMember.spouse) {
      const spouseIndex = updatedMembers.findIndex(m => m.id === newMember.spouse)
      if (spouseIndex !== -1) {
        updatedMembers[spouseIndex] = {
          ...updatedMembers[spouseIndex],
          spouse: newMember.id
        }
      }
    }

    setFamilyMembers([...updatedMembers, newMember])
    setNotifications(prev => [...prev, {
      id: Date.now(),
      message: `New family member added: ${member.name}`,
      type: 'success'
    }])
    toast.success(`Added ${member.name} to the family tree!`)
  }

  const updateRelationships = (memberId, updates) => {
    setFamilyMembers(prev => prev.map(member => {
      if (member.id === memberId) {
        return { ...member, ...updates }
      }
      return member
    }))
  }

  const removeFamilyMember = (id) => {
    const member = familyMembers.find(m => m.id === id)
    if (!member) return

    const updatedMembers = familyMembers.map(existingMember => {
      if (member.parents.includes(existingMember.id)) {
        return {
          ...existingMember,
          children: existingMember.children.filter(childId => childId !== id)
        }
      }
      return existingMember
    })

    if (member.spouse) {
      const spouseIndex = updatedMembers.findIndex(m => m.id === member.spouse)
      if (spouseIndex !== -1) {
        updatedMembers[spouseIndex] = {
          ...updatedMembers[spouseIndex],
          spouse: null
        }
      }
    }

    setFamilyMembers(updatedMembers.filter(m => m.id !== id))
    setNotifications(prev => [...prev, {
      id: Date.now(),
      message: `Removed ${member.name} from the family tree`,
      type: 'info'
    }])
    toast.info(`Removed ${member.name} from the family tree`)
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return (
    <FamilyContext.Provider value={{
      familyMembers,
      notifications,
      addFamilyMember,
      removeFamilyMember,
      updateRelationships,
      clearNotifications
    }}>
      {children}
    </FamilyContext.Provider>
  )
}

export const useFamily = () => {
  const context = useContext(FamilyContext)
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider')
  }
  return context
} 