"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import { AddApiKeyDialog } from './AddApiKeyDialog';
import { UpdateApiKeyDialog } from './UpdateApiKeyDialog';
import { DeleteApiKeyDialog } from './DeleteApiKeyDialog';

interface ApiKey {
  id: string;
  name: string;
  type: string;
  usage: number;
  key: string;
}

const ApiKeyManagement = () => {
  const { data: session } = useSession();
  const [apiKeys, setApiKeys] = React.useState<ApiKey[]>([]);
  const [loading, setLoading] = React.useState(true);
  console.log("session", session)

  // Fetch API keys
  const fetchApiKeys = async () => {
    if (!session?.user?.supabaseUserId) {
      console.log('No Supabase user ID found in session');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', session.user.supabaseUserId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching API keys:', error);
        throw error;
      }

      console.log('Fetched API keys:', data);
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error in fetchApiKeys:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load API keys on mount and when session changes
  React.useEffect(() => {
    if (session?.user?.supabaseUserId) {
      fetchApiKeys();
    }
  }, [session?.user?.supabaseUserId]);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  const handleAddKey = async (newKey: { name: string; type: string; key: string; user_id: string; usage: number }) => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .insert([newKey])
        .select();

      if (error) {
        console.error('Error adding API key:', error);
        throw error;
      }

      if (data) {
        setApiKeys([...data, ...apiKeys]);
      }
    } catch (error) {
      console.error('Error in handleAddKey:', error);
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setApiKeys(apiKeys.filter(key => key.id !== id));
    } catch (error) {
      console.error('Error deleting API key:', error);
    }
  };

  const handleUpdateKey = async (id: string, updates: Partial<ApiKey>) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      fetchApiKeys(); // Refresh the list
    } catch (error) {
      console.error('Error updating API key:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">API Keys</h2>
          <Button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
        {session?.user?.supabaseUserId && (
          <AddApiKeyDialog 
            onAddKey={handleAddKey} 
            userId={session.user.supabaseUserId} 
          />
        )}
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
              <tr key={apiKey.id} className="border-b">
                <td className="py-4 px-4">{apiKey.name}</td>
                <td className="py-4 px-4">{apiKey.type}</td>
                <td className="py-4 px-4">{apiKey.usage}</td>
                <td className="py-4 px-4 font-mono">{apiKey.key}</td>
                <td className="py-4 px-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyKey(apiKey.key)}
                      aria-label="Copy API key"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <UpdateApiKeyDialog 
                      apiKey={apiKey}
                      onUpdateKey={handleUpdateKey}
                    />
                    <DeleteApiKeyDialog onConfirm={() => handleDeleteKey(apiKey.id)} />
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