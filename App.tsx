import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { Provider } from 'react-redux'
import { setupStore } from './app/store'

import Parking from './features/parking/Parking'

export default function App() {
  return (
    <Provider store={setupStore()}>
      <Parking />
    </Provider>
  )
}

