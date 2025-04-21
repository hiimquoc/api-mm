"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

interface VerificationStatus {
  status: 'idle' | 'valid' | 'invalid'
  details?: {
    name: string
    type: string
  }
}

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = React.useState('')
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [verificationStatus, setVerificationStatus] = React.useState<VerificationStatus>({ status: 'idle' })

  const verifyApiKey = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    setVerificationStatus({ status: 'idle' })

    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, name, type')
        .eq('key', apiKey)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setVerificationStatus({ 
          status: 'valid',
          details: {
            name: data.name,
            type: data.type
          }
        })
        toast.success('API Key Verified', {
          description: `This is a valid ${data.type} API key named "${data.name}".`,
        })
      }
    } catch (error) {
      console.error('Error verifying API key:', error)
      setVerificationStatus({ status: 'invalid' })
      toast.error('Invalid API Key', {
        description: 'The provided API key is not valid.',
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const statusDisplay = {
    idle: {
      icon: <AlertCircle className="h-5 w-5 text-gray-400" />,
      title: 'Verification Status',
      description: 'Enter an API key above to verify its validity.',
      className: 'bg-gray-50 border-gray-200',
    },
    valid: {
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      title: 'Valid API Key',
      description: verificationStatus.details 
        ? `This is a valid ${verificationStatus.details.type} API key named "${verificationStatus.details.name}".`
        : 'This API key is valid.',
      className: 'bg-green-50 border-green-200',
    },
    invalid: {
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      title: 'Invalid API Key',
      description: 'The provided API key is not valid.',
      className: 'bg-red-50 border-red-200',
    },
  }

  const currentStatus = statusDisplay[verificationStatus.status]

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Pages</h1>
          <span className="text-gray-500">/</span>
          <span className="text-gray-500">API Playground</span>
        </div>
      </div>

      <h2 className="text-3xl font-bold">API Playground</h2>

      <div className="rounded-xl border p-8 space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">Verify API Key</h3>
          <p className="text-gray-600">
            Enter your API key below to verify if it&apos;s valid and get information about it.
          </p>
        </div>

        <form onSubmit={verifyApiKey} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              API Key
            </label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key (e.g., tvly-dev-...)"
              className="font-mono"
              required
            />
          </div>

          <Button type="submit" disabled={isVerifying}>
            {isVerifying ? 'Verifying...' : 'Verify API Key'}
          </Button>
        </form>

        <div className={`rounded-lg border p-4 ${currentStatus.className}`}>
          <div className="flex items-start gap-3">
            {currentStatus.icon}
            <div>
              <h4 className="font-medium">{currentStatus.title}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {currentStatus.description}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-medium mb-2">Example API Key Format</h4>
          <code className="bg-gray-100 p-2 rounded text-sm font-mono block">
            tvly-dev-abcdef123456
          </code>
          <p className="mt-2 text-sm text-gray-600">
            API keys start with &quot;tvly-&quot; followed by the type (dev/prod) and a unique identifier.
          </p>
        </div>
      </div>
    </div>
  )
} 