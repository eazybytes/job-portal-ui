import { createContext, useContext, useState, useEffect } from 'react';
import { delay } from '../utils/delay';

const AuthContext = createContext();

// Dummy credentials for testing
const DUMMY_USERS = {
  employers: [
    {
      id: 1,
      email: 'employer@company.com',
      password: 'employer123',
      name: 'John Smith',
      company: 'Tech Solutions Inc.',
      role: 'ROLE_EMPLOYER'
    },
    {
      id: 2,
      email: 'hr@startup.com',
      password: 'hr123',
      name: 'Sarah Johnson',
      company: 'Innovation Startup',
      role: 'ROLE_EMPLOYER'
    }
  ],
  jobSeekers: [
    {
      id: 3,
      email: 'jobseeker@email.com',
      password: 'jobseeker123',
      name: 'Alex Brown',
      title: 'Software Developer',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      bio: 'Experienced full-stack developer with 5 years in React and Node.js',
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
      experience: '5 years',
      portfolio: 'https://alexbrown.dev',
      profileImage: null,
      resume: 'data:application/pdf;base64,JVBERi0xLjcKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFsgMyAwIFIgXQovQ291bnQgMQo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDIgMCBSCi9NZWRpYUJveCBbIDAgMCA2MTIgNzkyIF0KL0NvbnRlbnRzIDQgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSAyNCBUZgoxMDAgNzAwIFRkCihTYW1wbGUgUmVzdW1lKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDIxMCAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDUKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjMwNQolJUVPRgo=',
      workHistory: [
        {
          id: 1,
          company: 'Tech Solutions Inc.',
          position: 'Senior Software Developer',
          startDate: '2020-01',
          endDate: '',
          current: true,
          description: 'Led development of scalable web applications using React and Node.js. Managed a team of 3 developers.'
        }
      ],
      education: [
        {
          id: 1,
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University of California, Berkeley',
          year: '2018',
          description: 'Focused on software engineering and web technologies'
        }
      ],
      profileComplete: true,
      role: 'ROLE_JOB_SEEKER'
    },
    {
      id: 4,
      email: 'candidate@email.com',
      password: 'candidate123',
      name: 'Emma Davis',
      title: 'Product Manager',
      phone: '+1 (555) 234-5678',
      location: 'New York, NY',
      bio: 'Strategic product manager with experience in agile development and market analysis',
      skills: ['Product Strategy', 'Agile', 'Analytics', 'Leadership', 'Market Research'],
      experience: '7 years',
      portfolio: 'https://emma-davis.com',
      profileImage: null,
      resume: null,
      workHistory: [
        {
          id: 1,
          company: 'Innovation Startup',
          position: 'Product Manager',
          startDate: '2021-03',
          endDate: '',
          current: true,
          description: 'Managing product roadmap and working with cross-functional teams to deliver user-centered solutions.'
        }
      ],
      education: [
        {
          id: 1,
          degree: 'Master of Business Administration',
          institution: 'Stanford University',
          year: '2020',
          description: 'Specialized in technology management and product development'
        }
      ],
      profileComplete: true,
      role: 'ROLE_JOB_SEEKER'
    }
  ],
  admins: [
    {
      id: 5,
      email: 'admin@portal.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'ROLE_ADMIN'
    }
  ]
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('jobPortalUser');
    const savedToken = localStorage.getItem('authToken');

    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);

        // MIGRATION: Check if email field looks like it contains a name instead of email
        if (parsedUser.email && !parsedUser.email.includes('@')) {
          console.warn('[Auth] Detected invalid cached user data. Clearing localStorage...');
          localStorage.removeItem('jobPortalUser');
          localStorage.removeItem('authToken');
          setIsLoading(false);
          return;
        }

        setUser(parsedUser);
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem('jobPortalUser');
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('jobPortalUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('jobPortalUser');
      localStorage.removeItem('authToken');
    }
  }, [user]);

  const login = async (email, password, userType) => {
    setIsLoading(true);

    try {
      await delay(500);

      // Search all dummy users
      const allDummyUsers = [
        ...DUMMY_USERS.employers,
        ...DUMMY_USERS.jobSeekers,
        ...DUMMY_USERS.admins
      ];

      // Also check localStorage for registered users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const searchPool = [...allDummyUsers, ...registeredUsers];

      const foundUser = searchPool.find(u => u.email === email && u.password === password);

      if (!foundUser) {
        setIsLoading(false);
        return { success: false, error: 'Invalid email or password' };
      }

      // Generate a fake token
      const fakeToken = 'mock-jwt-' + Date.now();
      localStorage.setItem('authToken', fakeToken);

      const userWithRole = {
        userId: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        mobileNumber: foundUser.phone || foundUser.mobileNumber || '',
        role: foundUser.role,
        company: foundUser.company,
        profileComplete: false,
      };

      // For job seekers, check if profile is complete
      if (foundUser.role === 'ROLE_JOB_SEEKER') {
        try {
          const { getProfile } = await import('../services/profileService');
          const profileData = await getProfile();

          const isComplete = !!(
            profileData &&
            profileData.jobTitle &&
            profileData.location &&
            profileData.experienceLevel &&
            profileData.professionalBio &&
            profileData.profilePictureName &&
            profileData.resumeName
          );

          userWithRole.profileComplete = isComplete;
        } catch (error) {
          // If error, keep profileComplete as false
        }
      } else {
        // Employers and admins don't need profile completion
        userWithRole.profileComplete = true;
      }

      setUser(userWithRole);
      setIsLoading(false);
      return { success: true, user: userWithRole };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };

  const register = async (userData) => {
    setIsLoading(true);

    try {
      await delay(500);

      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

      // Check all users for duplicate email
      const allDummyUsers = [
        ...DUMMY_USERS.employers,
        ...DUMMY_USERS.jobSeekers,
        ...DUMMY_USERS.admins
      ];

      if ([...allDummyUsers, ...registeredUsers].some(u => u.email === userData.email)) {
        setIsLoading(false);
        return { success: false, error: 'Email already registered' };
      }

      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        mobileNumber: userData.mobileNumber,
        password: userData.password,
        role: 'ROLE_JOB_SEEKER',
        profileComplete: false,
      };

      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      setIsLoading(false);
      return {
        success: true,
        message: 'Registration successful! You can now login.',
      };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };

  const updateProfile = async (profileData) => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    setIsLoading(true);

    try {
      await delay(500);

      const updatedUser = {
        ...user,
        ...profileData,
        updatedAt: new Date().toISOString()
      };

      setUser(updatedUser);
      setIsLoading(false);
      return { success: true, user: updatedUser };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const updateProfileComplete = (isComplete) => {
    if (user) {
      const updatedUser = {
        ...user,
        profileComplete: isComplete
      };
      setUser(updatedUser);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('jobPortalUser');
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    updateProfile,
    updateProfileComplete,
    logout,
    isAuthenticated: !!user,
    isEmployer: user?.role === 'ROLE_EMPLOYER',
    isJobSeeker: user?.role === 'ROLE_JOB_SEEKER',
    isAdmin: user?.role === 'ROLE_ADMIN'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
