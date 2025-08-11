import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface ShippingInfo {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  shippingInfo?: ShippingInfo;
}

export function useUserProfile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!session?.user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchProfile(); // Refresh profile data
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const formatSavedAddress = (shippingInfo?: ShippingInfo) => {
    if (!shippingInfo?.address) return '';
    
    const parts = [
      shippingInfo.address,
      shippingInfo.city,
      shippingInfo.postalCode
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  return {
    profile,
    loading,
    updateProfile,
    refreshProfile: fetchProfile,
    formatSavedAddress,
    hasSavedAddress: !!profile?.shippingInfo?.address,
  };
}

// Hook для автозаповнення форм замовлення
export function useOrderFormAutofill() {
  const { profile } = useUserProfile();

  const getAutofillData = () => {
    if (!profile) return {};

    return {
      customerName: profile.name || '',
      customerEmail: profile.email || '',
      customerPhone: profile.phone || '',
      deliveryAddress: profile.shippingInfo?.address 
        ? [
            profile.shippingInfo.address,
            profile.shippingInfo.city,
            profile.shippingInfo.postalCode
          ].filter(Boolean).join(', ')
        : '',
    };
  };

  const getSavedShippingInfo = () => {
    return profile?.shippingInfo || null;
  };

  return {
    getAutofillData,
    getSavedShippingInfo,
    hasSavedAddress: !!profile?.shippingInfo?.address,
    profile,
  };
}
