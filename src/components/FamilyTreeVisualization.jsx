import React, { useEffect, useRef, useState } from 'react'
import { useFamily } from '../context/FamilyContext'
import Treant from 'treant-js'
import 'treant-js/Treant.css'

const FamilyTreeVisualization = () => {
  const { familyMembers } = useFamily()
  const treeRef = useRef(null)
  const [treeInstance, setTreeInstance] = useState(null)

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
        levelSeparation: 120,
        siblingSeparation: 80,
        subTeeSeparation: 80,
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

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Family Tree</h2>
      <div id="tree-simple" ref={treeRef} className="w-full min-h-[600px] overflow-auto"></div>
    </div>
  )
}

export default FamilyTreeVisualization 