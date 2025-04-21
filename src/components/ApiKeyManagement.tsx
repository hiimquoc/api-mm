"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Copy, Pencil, Trash, Plus } from 'lucide-react';

interface ApiKey {
  name: string;
  type: string;
  usage: number;
  key: string;
}

const ApiKeyManagement = () => {
  const [apiKeys, setApiKeys] = React.useState<ApiKey[]>([
    {
      name: 'default',
      type: 'dev',
      usage: 0,
      key: 'tvly-dev-********************************',
    },
  ]);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  const handleAddKey = () => {
    // Implementation for adding new key
  };

  const handleDeleteKey = (name: string) => {
    setApiKeys(apiKeys.filter(key => key.name !== name));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">API Keys</h2>
        <Button 
          onClick={handleAddKey}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      <p className="text-gray-600 mb-6">
        The key is used to authenticate your requests to the Research API. To learn more, see the documentation page.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-4 px-4 font-medium">NAME</th>
              <th className="text-left py-4 px-4 font-medium">TYPE</th>
              <th className="text-left py-4 px-4 font-medium">USAGE</th>
              <th className="text-left py-4 px-4 font-medium">KEY</th>
              <th className="text-right py-4 px-4 font-medium">OPTIONS</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((apiKey) => (
              <tr key={apiKey.name} className="border-b">
                <td className="py-4 px-4">{apiKey.name}</td>
                <td className="py-4 px-4">{apiKey.type}</td>
                <td className="py-4 px-4">{apiKey.usage}</td>
                <td className="py-4 px-4 font-mono">{apiKey.key}</td>
                <td className="py-4 px-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {}}
                      aria-label="View API key"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyKey(apiKey.key)}
                      aria-label="Copy API key"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {}}
                      aria-label="Edit API key"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteKey(apiKey.name)}
                      aria-label="Delete API key"
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiKeyManagement; 