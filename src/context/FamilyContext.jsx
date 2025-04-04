import React, { createContext, useContext, useState } from 'react'
import { toast } from 'react-toastify'

const FamilyContext = createContext()

export const FamilyProvider = ({ children }) => {
  // Simplified mock data with English names
  const mockData = [
    {
      id: 1,
      name: 'John Smith',
      age: 45,
      gender: 'male',
      parents: [],
      spouse: null,
      children: [2]
    },
    {
      id: 2,
      name: 'Tom Smith',
      age: 20,
      gender: 'male',
      parents: [1],
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
    // First, find the member to update
    const memberToUpdate = familyMembers.find(m => m.id === memberId)
    if (!memberToUpdate) return
    
    // Create a copy of the current members
    let updatedMembers = [...familyMembers]
    
    // Update the member's basic info
    const memberIndex = updatedMembers.findIndex(m => m.id === memberId)
    updatedMembers[memberIndex] = {
      ...updatedMembers[memberIndex],
      name: updates.name,
      age: updates.age,
      gender: updates.gender
    }
    
    // Handle parent relationship changes
    if (updates.parents !== undefined) {
      // Remove this member from their old parents' children arrays
      updatedMembers = updatedMembers.map(member => {
        if (memberToUpdate.parents && memberToUpdate.parents.includes(member.id)) {
          return {
            ...member,
            children: member.children.filter(id => id !== memberId)
          }
        }
        return member
      })
      
      // Add this member to their new parents' children arrays
      updatedMembers = updatedMembers.map(member => {
        if (updates.parents.includes(member.id)) {
          return {
            ...member,
            children: [...member.children, memberId]
          }
        }
        return member
      })
      
      // Update the member's parents
      updatedMembers[memberIndex].parents = updates.parents
    }
    
    // Handle spouse relationship changes
    if (updates.spouse !== undefined) {
      // Remove this member from their old spouse's spouse field
      updatedMembers = updatedMembers.map(member => {
        if (member.id === memberToUpdate.spouse) {
          return {
            ...member,
            spouse: null
          }
        }
        return member
      })
      
      // Set this member's new spouse
      updatedMembers[memberIndex].spouse = updates.spouse
      
      // Set the spouse's spouse field to this member
      if (updates.spouse !== null) {
        updatedMembers = updatedMembers.map(member => {
          if (member.id === updates.spouse) {
            return {
              ...member,
              spouse: memberId
            }
          }
          return member
        })
      }
    }
    
    // Update the state with all changes
    setFamilyMembers(updatedMembers)
    
    // Show success notification
    toast.success(`Updated ${updates.name}'s information`)
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