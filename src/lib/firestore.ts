import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from './firebase'

// Types for user data
export interface Task {
  id: string
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
}

export interface Habit {
  id: string
  name: string
  completed: boolean
}

export interface UserData {
  tasks: Task[]
  notes: string
  habits: Habit[]
  quickLinks: { id: string; name: string; url: string }[]
  preferences: {
    wallpaper: string
    accentColor: string
    avatar: string
    city: string
  }
  focusSessions: number
  updatedAt?: unknown
}

// Default data for new users
const defaultUserData: UserData = {
  tasks: [],
  notes: '',
  habits: [
    { id: '1', name: 'Exercise', completed: false },
    { id: '2', name: 'Read', completed: false },
    { id: '3', name: 'Meditate', completed: false },
    { id: '4', name: 'Journal', completed: false },
  ],
  quickLinks: [
    { id: '1', name: 'GitHub', url: 'https://github.com' },
    { id: '2', name: 'Twitter', url: 'https://twitter.com' },
  ],
  preferences: {
    wallpaper: 'dynamic',
    accentColor: 'blue',
    avatar: 'astronaut',
    city: 'New Delhi',
  },
  focusSessions: 0,
}

// Get user document reference
const getUserDocRef = (userId: string) => doc(db, 'users', userId)

// Save all user data to Firestore
export const saveUserData = async (userId: string, data: Partial<UserData>): Promise<void> => {
  try {
    const userRef = getUserDocRef(userId)
    await setDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true })
    console.log('✅ Data saved to cloud')
  } catch (error) {
    console.error('❌ Error saving to cloud:', error)
    throw error
  }
}

// Load user data from Firestore
export const loadUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userRef = getUserDocRef(userId)
    const docSnap = await getDoc(userRef)
    
    if (docSnap.exists()) {
      console.log('✅ Data loaded from cloud')
      return docSnap.data() as UserData
    } else {
      // Create default data for new user
      console.log('📝 Creating default data for new user')
      await setDoc(userRef, {
        ...defaultUserData,
        updatedAt: serverTimestamp(),
      })
      return defaultUserData
    }
  } catch (error) {
    console.error('❌ Error loading from cloud:', error)
    return null
  }
}

// Update specific fields
export const updateUserField = async <K extends keyof UserData>(
  userId: string, 
  field: K, 
  value: UserData[K]
): Promise<void> => {
  try {
    const userRef = getUserDocRef(userId)
    await updateDoc(userRef, {
      [field]: value,
      updatedAt: serverTimestamp(),
    })
    console.log(`✅ ${field} synced to cloud`)
  } catch (error) {
    console.error(`❌ Error syncing ${field}:`, error)
    // If document doesn't exist, create it
    await saveUserData(userId, { [field]: value } as Partial<UserData>)
  }
}

// Sync tasks
export const syncTasks = (userId: string, tasks: Task[]) => updateUserField(userId, 'tasks', tasks)

// Sync notes
export const syncNotes = (userId: string, notes: string) => updateUserField(userId, 'notes', notes)

// Sync habits
export const syncHabits = (userId: string, habits: Habit[]) => updateUserField(userId, 'habits', habits)

// Sync preferences
export const syncPreferences = (userId: string, preferences: UserData['preferences']) => 
  updateUserField(userId, 'preferences', preferences)

// Sync focus sessions
export const syncFocusSessions = (userId: string, sessions: number) => 
  updateUserField(userId, 'focusSessions', sessions)

// Sync quick links
export const syncQuickLinks = (userId: string, links: UserData['quickLinks']) => 
  updateUserField(userId, 'quickLinks', links)

