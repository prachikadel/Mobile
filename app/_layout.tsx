import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Slot } from 'expo-router'

export default function RootLayout() {
    const publishableKey="pk_test_ZWxlY3RyaWMtbW90aC0wLmNsZXJrLmFjY291bnRzLmRldiQ"
  return (
    <ClerkProvider tokenCache={tokenCache}publishableKey={publishableKey}>
      <Slot />
    </ClerkProvider>
  )
}