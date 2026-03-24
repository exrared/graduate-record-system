import { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext()

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}

// Default settings
const defaultSettings = {
  darkMode: false,
  fontFamily: 'Poppins',
  fontSize: '12px',
  sideNavColor: '#1e293b',
  topNavColor: '#ffffff',
  sideNavFontColor: '#e2e8f0',
  sideNavHoverColor: '#ffffff',
  sideNavActiveColor: '#ffffff',
  topNavFontColor: '#1f2937',
  loginBackgroundType: 'color',
  loginBackgroundColor: '#d6d6d6',
  loginBackgroundImage: '',
  loginFormBgColor: '#ffffff',
  loginFormBgOpacity: 89,
}

export const SettingsProvider = ({ children }) => {

  const [settings, setSettings] = useState(defaultSettings)

  useEffect(() => {
    // Check if appSettings exists in localStorage
    const savedSettings = localStorage.getItem('appSettings')
    let currentSettings = defaultSettings
    
    if (!savedSettings) {
      // If no settings exist, set default values to localStorage
      localStorage.setItem('appSettings', JSON.stringify(defaultSettings))
      setSettings(defaultSettings)
    } else {
      // Load existing settings from localStorage
      currentSettings = JSON.parse(savedSettings)
      setSettings(currentSettings)
    }
    
    // Apply settings to document
    // Apply dark mode
    if (currentSettings.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Apply font family
    document.documentElement.style.setProperty('--font-family', currentSettings.fontFamily)
    
    // Apply font size
    document.documentElement.style.fontSize = currentSettings.fontSize
  }, [])

  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem('appSettings', JSON.stringify(updated))
    
    // Apply dark mode
    if (updated.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Apply font family
    document.documentElement.style.setProperty('--font-family', updated.fontFamily)
    
    // Apply font size
    document.documentElement.style.fontSize = updated.fontSize
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}
