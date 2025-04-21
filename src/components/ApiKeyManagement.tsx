"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import { AddApiKeyDialog } from './AddApiKeyDialog';
import { UpdateApiKeyDialog } from './UpdateApiKeyDialog';
import { DeleteApiKeyDialog } from './DeleteApiKeyDialog';
import { ApiKeyDisplay } from './ApiKeyDisplay';
import { toast } from 'sonner';

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
    toast.success("API Key Copied", {
      description: "The API key has been copied to your clipboard.",
    });
  };

  const handleAddKey = async (newKey: { name: string; type: string; key: string; user_id: string; usage: number }) => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .insert([newKey])
        .select();

      if (error) {
        console.error('Error adding API key:', error);
        toast.error("Error", {
          description: "Failed to add API key. Please try again.",
        });
        throw error;
      }

      if (data) {
        setApiKeys([...data, ...apiKeys]);
        toast.success("API Key Added", {
          description: "Your new API key has been added successfully.",
        });
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

      if (error) {
        toast.error("Error", {
          description: "Failed to delete API key. Please try again.",
        });
        throw error;
      }
      setApiKeys(apiKeys.filter(key => key.id !== id));
      toast.success("API Key Deleted", {
        description: "The API key has been deleted successfully.",
      });
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

      if (error) {
        toast.error("Error", {
          description: "Failed to update API key. Please try again.",
        });
        throw error;
      }
      fetchApiKeys(); // Refresh the list
      toast.success("API Key Updated", {
        description: "The API key has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating API key:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/login' });
      toast.success("Signed Out", {
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Error", {
        description: "Failed to sign out. Please try again.",
      });
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
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Pages</h1>
          <span className="text-gray-500">/</span>
          <span className="text-gray-500">Overview</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full" />
            <span>Operational</span>
          </div>
          <Button variant="ghost" size="icon">
            <LogOut className="h-4 w-4" onClick={handleSignOut} />
          </Button>
        </div>
      </div>

      <h2 className="text-3xl font-bold">Overview</h2>

      <div className="rounded-xl p-8 bg-gradient-to-r from-rose-100 via-purple-200 to-blue-200">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">CURRENT PLAN</span>
            <Button variant="secondary" className="bg-white">
              Manage Plan
            </Button>
          </div>
          
          <h3 className="text-4xl font-bold">Researcher</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">API Usage</span>
              <div className="h-4 w-4 rounded-full border flex items-center justify-center text-xs">i</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Plan</span>
                <span>0 / 1,000 Credits</span>
              </div>
              <div className="h-2 w-full bg-white/50 rounded-full">
                <div className="h-full w-0 bg-white rounded-full" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm">Pay as you go</span>
              <div className="h-4 w-4 rounded-full border flex items-center justify-center text-xs">i</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">API Keys</h3>
          <AddApiKeyDialog onAddKey={handleAddKey} userId={session?.user?.supabaseUserId || ''} />
        </div>

        <p className="text-gray-600">
          The key is used to authenticate your requests to the Research API. To learn more, see the documentation page.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4 font-medium text-gray-500">NAME</th>
                <th className="text-left py-4 px-4 font-medium text-gray-500">TYPE</th>
                <th className="text-left py-4 px-4 font-medium text-gray-500">USAGE</th>
                <th className="text-left py-4 px-4 font-medium text-gray-500">KEY</th>
                <th className="text-right py-4 px-4 font-medium text-gray-500">OPTIONS</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((apiKey) => (
                <tr key={apiKey.id} className="border-b">
                  <td className="py-4 px-4">{apiKey.name}</td>
                  <td className="py-4 px-4">{apiKey.type}</td>
                  <td className="py-4 px-4">{apiKey.usage}</td>
                  <td className="py-4 px-4">
                    <ApiKeyDisplay apiKey={apiKey.key} />
                  </td>
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
    </div>
  );
};

export default ApiKeyManagement; 