
// Types for user authentication
export interface User {
  id: string;
  email: string;
  name: string;
  role: "ouvrier" | "admin";
  avatarUrl: string;
}

// Test users
export const testUsers: User[] = [
  {
    id: "1",
    email: "ouvrier@avem.fr", 
    name: "Thomas",
    role: "ouvrier",
    avatarUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
  },
  {
    id: "2",
    email: "admin@avem.fr",
    name: "Sarah",
    role: "admin",
    avatarUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
  }
];

// Simple authentication function
export const authenticateUser = (email: string, password: string): User | null => {
  // In a real app, you would validate the password properly
  // For this demo, any password works
  const user = testUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  return user || null;
};

// Store the current user in localStorage
export const setCurrentUser = (user: User): void => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

// Get the current user from localStorage
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('currentUser');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as User;
  } catch (e) {
    console.error('Error parsing user from localStorage', e);
    return null;
  }
};

// Clear the current user from localStorage (logout)
export const clearCurrentUser = (): void => {
  localStorage.removeItem('currentUser');
};
