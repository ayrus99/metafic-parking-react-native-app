import React, { useRef, useState } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native'

import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { initialize, fill, remove, selectSpaces } from './parkingSlice'

export function Parking() {
  const spaces = useAppSelector(selectSpaces)
  const dispatch = useAppDispatch()

  const [numOfSpaces, setNumOfSpaces] = useState(0)
  const [regNum, setRegNum] = useState('')

  const initializeHandler = () => {
    try {
      dispatch(initialize(numOfSpaces))
    } catch (error) {
      Alert.alert('Error', 'Something Went Wrong.')
    }
  }

  const parkHandler = () => {
    try {
      dispatch(fill(regNum))
    } catch (error) {
      Alert.alert('Error', error.message)
    }
  }

  const removeFormHandler = (id: number) => {
    try {
      dispatch(remove(id))
    } catch (error) {
      Alert.alert('Error', 'Something Went Wrong.')
    }
  }

  return spaces.length === 0 ? (
    <View style={styles.screen}>
      <TextInput
        placeholder="Enter the number of Spaces"
        keyboardType={'number-pad'}
        style={styles.input}
        value={numOfSpaces.toString()}
        onChangeText={(text) =>
          setNumOfSpaces(parseInt(text) ? parseInt(text) : 0)
        }
      />
      <TouchableOpacity onPress={initializeHandler} style={styles.button}>
        <Text style={styles.buttonText}>Create Parking Lot</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter Regitration Number"
          value={regNum}
          onChangeText={(text) => setRegNum(text)}
          style={styles.input}
        />
        <TouchableOpacity onPress={parkHandler} style={styles.button}>
          <Text style={styles.buttonText}>Park</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.spaceContainer}>
        {spaces.map((space, index) => (
          <TouchableOpacity
            key={index}
            style={space.registration ? styles.parkedSpace : styles.emptySpace}
            onPress={() => {
              space.arrival && removeFormHandler(parseInt(space.id))
            }}
          >
            <View>
              <Text>Id: {space.id}</Text>
            </View>
            {space.registration && (
              <View>
                <Text>{space.registration}</Text>
              </View>
            )}
            {space.arrival && (
              <View>
                <Text>{space.arrival.toLocaleTimeString()}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgrey',
  },
  inputContainer: {
    backgroundColor: 'grey',
    padding: 15,
    marginTop: 50,
    width: '95%',
    borderRadius: 5,
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgrey',
  },
  button: {
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'center'
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderColor: 'dimgrey',
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    backgroundColor:'lightgrey'
  },
  emptySpace: {
    borderColor: 'black',
    borderWidth: 2,
    marginVertical: '2%',
    width: '30%',
    height: 75,
    padding: 5,
  },
  parkedSpace: {
    borderColor: 'black',
    borderWidth: 2,
    marginVertical: '2%',
    width: '30%',
    height: 75,
    padding: 5,
    backgroundColor: 'lightgreen',
  },
  spaceContainer: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
})
