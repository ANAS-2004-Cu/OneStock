import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getUserData } from '../Firebase/DBAPI';
import { auth } from '../Firebase/MAINAPI';


interface Address {
  id: string;
  FullName: string;
  Street: string;
  City: string;
  State: string;
  ZIP: string;
  Phone: string;
  isDefault: boolean;
}

interface User {
  username?: string;
  email?: string;
  image?: string;
  phone?: string;
  isAdmin?: boolean;
  isBlocked?: boolean;
  Fav?: string[];
  Addresses: Address[];
  [key: string]: any;
}

type UserInput = Omit<User, 'Addresses'> & {
  Addresses?: Address[];
};

interface UserStore {
  user: User | null;
  isLoggedIn: boolean;
  isBootstrapped: boolean;
  login: (userData: UserInput) => void;
  logout: () => void;
  setUser: (userData: UserInput | null) => void;
  bootstrapAuth: () => Promise<void>;
}

const ensureUserAddresses = (userData: UserInput): User => {
  const normalizedAddresses = Array.isArray(userData.Addresses)
    ? userData.Addresses
    : [];
  const normalizedFav = Array.isArray(userData.Fav)
    ? userData.Fav
    : [];

  const { Addresses: _addresses, Fav: _fav, ...rest } = userData;

  return {
    ...(rest as Omit<User, 'Addresses' | 'Fav'>),
    Addresses: normalizedAddresses,
    Fav: normalizedFav,
  };
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isBootstrapped: false,
      login: (userData: UserInput) =>
        set({ user: ensureUserAddresses(userData), isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
      setUser: (userData: UserInput | null) =>
        set({
          user: userData ? ensureUserAddresses(userData) : null
        }),
      bootstrapAuth: async () => {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          set({ user: null, isLoggedIn: false, isBootstrapped: true });
          return;
        }

        try {
          const userData = await getUserData(currentUser.uid);

          if (userData) {
            set({
              user: ensureUserAddresses(userData),
              isLoggedIn: true,
              isBootstrapped: true,
            });
            return;
          }

          set({ user: null, isLoggedIn: false, isBootstrapped: true });
        } catch (error) {
          set({ user: null, isLoggedIn: false, isBootstrapped: true });
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
  
);
