import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PersonDetailsFormProps {
  onSubmit: (details: { field1: string; field2: string; field3: string }) => void
  onCancel: () => void
}

export function PersonDetailsForm({ onSubmit, onCancel }: PersonDetailsFormProps) {
  const [details, setDetails] = useState({ field1: '', field2: '', field3: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDetails(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(details)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-white">Add Person Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="field1" className="text-gray-300">Field 1</Label>
            <Input
              id="field1"
              name="field1"
              value={details.field1}
              onChange={handleChange}
              className="w-full bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="field2" className="text-gray-300">Field 2</Label>
            <Input
              id="field2"
              name="field2"
              value={details.field2}
              onChange={handleChange}
              className="w-full bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="field3" className="text-gray-300">Field 3</Label>
            <Input
              id="field3"
              name="field3"
              value={details.field3}
              onChange={handleChange}
              className="w-full bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={onCancel} variant="outline" className="bg-gray-700 text-gray-100 hover:bg-gray-600">
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
              Add Details
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

