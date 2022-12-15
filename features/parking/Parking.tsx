import React, { useRef, useState } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native'

import { useAppSelector, useAppDispatch } from '../../app/hooks'
import {
  initialize,
  fill,
  remove,
  selectSpaces,
  SpaceState,
} from './parkingSlice'

export const getDuration = (arrival: Date) => {
  return Math.ceil(Math.abs(new Date().getTime() - arrival.getTime()) / (1000 * 60 * 60))
}

export const getAmount = (arrival: Date) => {
  const duration = getDuration(arrival)
  return duration <= 2 ? 10 : (duration - 2) * 10
}

const Parking = () => {
  const spaces = useAppSelector(selectSpaces)
  const dispatch = useAppDispatch()

  const [numOfSpaces, setNumOfSpaces] = useState(0)
  const [regNum, setRegNum] = useState('')
  const [parkOutSpace, setParkOutSpace] = useState<SpaceState>({
    id: '-1',
    arrival: null,
    registration: null,
  })
  const [parkOutModal, setParkOutModal] = useState(false)

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
    } catch (error: any) {
      Alert.alert('Error', error.message)
    }
  }

  const parkOutHandler = () => {
    dispatch(remove(parseInt(parkOutSpace.id)))
    setParkOutModal(false)
  }



  return spaces.length === 0 ? (
    <View style={styles.screen}>
      <TextInput
        accessibilityLabel='spaceTextInput'
        placeholder="Enter the number of Spaces"
        keyboardType={'number-pad'}
        style={styles.input}
        value={numOfSpaces.toString()}
        onChangeText={(text) =>
          setNumOfSpaces(parseInt(text) ? parseInt(text) : 0)
        }
      />
      <TouchableOpacity accessibilityLabel="createParkingButton" onPress={initializeHandler} style={styles.button}>
        <Text style={styles.buttonText}>Create Parking Lot</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <ScrollView accessibilityLabel='scrollView' contentContainerStyle={styles.scrollContent}>
      <Modal
        visible={parkOutModal}
        transparent={true}
        onRequestClose={() => setParkOutModal(false)}
        accessibilityLabel='modal'
      >
        <View style={styles.dialogContainer}>
          <View style={styles.dialogBox}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
              Parking Checkout
            </Text>
            <Text>Id: {parkOutSpace.id}</Text>
            <Text>Registraion: {parkOutSpace.registration}</Text>
            <Text>Arrival: {parkOutSpace.arrival?.toLocaleTimeString()}</Text>
            <Text>Departure: {new Date().toLocaleTimeString()}</Text>
            <Text>
              Duration:{' '}
              {getDuration(
                parkOutSpace.arrival ? parkOutSpace.arrival : new Date(),
              )}
              hrs
            </Text>
            <Text>
              Amount: $
              {getAmount(
                parkOutSpace.arrival ? parkOutSpace.arrival : new Date(),
              )}
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                accessibilityLabel='modalCancelButton'
                style={styles.button}
                onPress={() => setParkOutModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity accessibilityLabel='modalPaidButton' style={styles.button} onPress={parkOutHandler}>
                <Text style={styles.buttonText}>Paid</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.inputContainer}>
        <TextInput
          accessibilityLabel='regTextInput'
          placeholder="Enter Regitration Number"
          value={regNum}
          onChangeText={(text) => setRegNum(text)}
          style={styles.input}
        />
        <TouchableOpacity accessibilityLabel="parkButton" onPress={parkHandler} style={styles.button}>
          <Text style={styles.buttonText}>Park</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.spaceContainer}>
        {spaces.map((space, index) => (
          <TouchableOpacity
            accessibilityLabel={'vacateButton' + index}
            key={index}
            style={space.registration ? styles.parkedSpace : styles.emptySpace}
            // onPress={() => {
            //   space.arrival && removeFormHandler(parseInt(space.id))
            // }10
            onPress={() => {
              if (space.arrival) {
                setParkOutSpace(space)
                setParkOutModal(true)
              }
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
    alignSelf: 'center',
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
    backgroundColor: 'lightgrey',
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
  dialogContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogBox: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 5,
    padding: 10,
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'white',
    width: '80%',
    //height: 150,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
})

export default Parking