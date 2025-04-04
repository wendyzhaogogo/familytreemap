import React, { useEffect, useRef, useState } from 'react'
import { useFamily } from '../context/FamilyContext'
import 'treant-js/Treant.css'
// Import Raphael first
import Raphael from 'raphael'
// Then import Treant
import { Treant } from 'treant-js'
import EditMember from './EditMember'

// Make Raphael available globally
window.Raphael = Raphael

const FamilyTreeVisualization = () => {
  const { familyMembers } = useFamily()
  const treeRef = useRef(null)
  const [treeInstance, setTreeInstance] = useState(null)
  const [selectedMemberId, setSelectedMemberId] = useState(null)

  useEffect(() => {
    if (familyMembers.length === 0) {
      return
    }

    // Clean up previous instance if it exists
    if (treeInstance) {
      treeInstance.destroy()
    }

    const treeStructure = buildTreeStructure(familyMembers)
    
    if (!treeStructure) {
      console.log('No valid tree structure could be built')
      return
    }

    const config = {
      chart: {
        container: '#tree-simple',
        levelSeparation: 80,
        siblingSeparation: 60,
        subTeeSeparation: 60,
        rootOrientation: 'NORTH',
        node: {
          HTMLclass: 'nodeExample1',
          drawLineThrough: false
        },
        connectors: {
          type: 'step',
          style: {
            'stroke-width': 2,
            'stroke': '#ccc'
          }
        },
        animation: {
          nodeAnimation: 'easeOutBounce',
          nodeSpeed: 700,
          connectorsAnimation: 'bounce',
          connectorsSpeed: 700
        },
        callback: {
          onClick: (node) => {
            const nodeId = node.nodeId
            const memberId = findMemberIdByNodeId(nodeId, familyMembers)
            if (memberId) {
              setSelectedMemberId(memberId)
            }
          }
        }
      },
      nodeStructure: treeStructure
    }

    try {
      if (treeRef.current) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          const newInstance = new Treant(config)
          setTreeInstance(newInstance)
        }, 100)
      }
    } catch (error) {
      console.error('Error initializing Treant:', error)
    }

    return () => {
      if (treeInstance) {
        treeInstance.destroy()
      }
    }
  }, [familyMembers])

  // Helper function to find member ID by node ID
  const findMemberIdByNodeId = (nodeId, members) => {
    // Skip the virtual root node
    if (nodeId === 'tree-simple') return null
    
    // Find the member with the matching name
    const nodeName = document.querySelector(`#${nodeId} .name`).textContent
    const member = members.find(m => m.name === nodeName)
    return member ? member.id : null
  }

  const buildTreeStructure = (members) => {
    if (!members || members.length === 0) {
      return null
    }

    // Find root members (those without parents)
    const rootMembers = members.filter(member => 
      !member.parents || member.parents.length === 0
    )

    // If no root members found, use the first member as root
    if (rootMembers.length === 0 && members.length > 0) {
      rootMembers.push(members[0])
    }

    // Build the tree structure
    const buildNode = (member) => {
      const node = {
        text: { 
          name: member.name,
          title: `Age: ${member.age}`
        },
        HTMLclass: member.gender === 'male' ? 'male' : 'female',
        children: []
      }

      // Add spouse if exists
      if (member.spouse) {
        const spouse = members.find(m => m.id === member.spouse)
        if (spouse) {
          node.text.name += ` + ${spouse.name}`
        }
      }

      // Add children
      const children = members.filter(m => 
        m.parents && m.parents.includes(member.id)
      )
      
      if (children.length > 0) {
        node.children = children.map(child => buildNode(child))
      }

      return node
    }

    // If we have multiple root members, create a virtual root
    if (rootMembers.length > 1) {
      return {
        text: { name: 'Family Tree' },
        children: rootMembers.map(member => buildNode(member))
      }
    }

    // Single root case
    return buildNode(rootMembers[0])
  }

  const handleCloseEdit = () => {
    setSelectedMemberId(null)
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-center">Family Tree</h2>
      <div 
        id="tree-simple" 
        ref={treeRef} 
        className="w-full overflow-auto" 
        style={{ 
          height: '500px',
          maxHeight: '80vh',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          padding: '20px'
        }}
      ></div>
      
      {selectedMemberId && (
        <EditMember 
          memberId={selectedMemberId} 
          onClose={handleCloseEdit} 
        />
      )}
    </div>
  )
}

export default FamilyTreeVisualization 