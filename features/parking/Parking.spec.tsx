import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Parking from './Parking';
import { RootState, setupStore } from '../../app/store'
import { renderWithProviders } from '../../utils/test-utils';
import { PreloadedState } from '@reduxjs/toolkit'
import { Provider } from 'react-redux';
import { Alert, BackHandler } from 'react-native';




test('Parking Component', async () => {

  jest.spyOn(Alert, 'alert');

  jest.spyOn(BackHandler, 'addEventListener')

  // renderWithProviders(<Parking />);
  const store = setupStore()
  const renderedComponent = render(<Provider store={store}><Parking /></Provider>)

  // INITIAL RENDER
  expect(screen.getByText('Create Parking Lot')).toBeVisible();
  expect(screen.getByLabelText('createParkingButton')).toBeVisible();
  expect(screen.getByLabelText('spaceTextInput')).toBeVisible();

  // INITIATED WITH SPACE -1 ERROR
  fireEvent(screen.getByLabelText('spaceTextInput'), 'onChangeText', '-1')
  fireEvent(screen.getByLabelText('createParkingButton'), 'onPress')
  expect(store.getState().parking.numSpaces).toEqual(0);
  expect(store.getState().parking.numParkedSpaces).toEqual(0);
  expect(store.getState().parking.spaces).toEqual([]);

  // INITIATED WITH SPACE 1
  fireEvent(screen.getByLabelText('spaceTextInput'), 'onChangeText', '1')
  fireEvent(screen.getByLabelText('createParkingButton'), 'onPress')
  expect(screen.getByLabelText('scrollView')).toBeVisible();
  expect(store.getState().parking.numSpaces).toEqual(1);
  expect(store.getState().parking.numParkedSpaces).toEqual(0);
  expect(store.getState().parking.spaces).toEqual([{ id: '0', registration: null, arrival: null }]);

  // PARKED A CAR
  fireEvent(screen.getByLabelText('regTextInput'), 'onChangeText', 'UK 07 4543')
  fireEvent(screen.getByLabelText('parkButton'), 'onPress')
  expect(store.getState().parking.numParkedSpaces).toEqual(1);
  expect(store.getState().parking.spaces[0].registration).toEqual('UK 07 4543');

  // TRIED TO PARK THE CAR BUT PARKING FULL
  fireEvent(screen.getByLabelText('regTextInput'), 'onChangeText', 'UK 07 4543')
  fireEvent(screen.getByLabelText('parkButton'), 'onPress')
  expect(Alert.alert).toHaveBeenCalledWith('Error', 'Parking Full.')
  expect(store.getState().parking.numParkedSpaces).toEqual(1);
  expect(store.getState().parking.spaces[0].registration).toEqual('UK 07 4543');

  // CLICKED ON VACATE PARKING SPACE
  fireEvent(screen.getByLabelText('vacateButton0'), 'onPress')
  expect(screen.getByLabelText('modal')).toBeVisible();

  // CANCELLED MODAL
  fireEvent(screen.getByLabelText('modal'), 'onRequestClose')
  expect(screen.getByLabelText('modal')).not.toBeVisible();

  // CLICKED ON VACATE PARKING SPACE
  fireEvent(screen.getByLabelText('vacateButton0'), 'onPress')
  expect(screen.getByLabelText('modal')).toBeVisible();

  // CANCELLED MODAL
  fireEvent(screen.getByLabelText('modalCancelButton'), 'onPress')
  expect(screen.getByLabelText('modal')).not.toBeVisible();

  // CLICKED ON VACATE PARKING SPACE
  fireEvent(screen.getByLabelText('vacateButton0'), 'onPress')
  expect(screen.getByLabelText('modal')).toBeVisible();

  // VACATED PARKING SPACE
  fireEvent(screen.getByLabelText('modalPaidButton'), 'onPress')
  expect(store.getState().parking.numParkedSpaces).toEqual(0);
  expect(store.getState().parking.spaces).toEqual([{ id: '0', registration: null, arrival: null }]);

  // PARKED A CAR
  fireEvent(screen.getByLabelText('regTextInput'), 'onChangeText', 'UK 07 4543')
  fireEvent(screen.getByLabelText('parkButton'), 'onPress')
  expect(store.getState().parking.numParkedSpaces).toEqual(1);
  expect(store.getState().parking.spaces[0].registration).toEqual('UK 07 4543');
})



test('Parking Component', async () => {

  jest.spyOn(Alert, 'alert');


  // renderWithProviders(<Parking />);
  const store = setupStore()
  render(<Provider store={store}><Parking /></Provider>)



  // INITIATED WITH SPACE 5
  fireEvent(screen.getByLabelText('spaceTextInput'), 'onChangeText', '5')
  fireEvent(screen.getByLabelText('createParkingButton'), 'onPress')
  expect(screen.getByLabelText('scrollView')).toBeVisible();
  expect(store.getState().parking.numSpaces).toEqual(5);
  expect(store.getState().parking.numParkedSpaces).toEqual(0);

  // PARKED A CAR
  fireEvent(screen.getByLabelText('regTextInput'), 'onChangeText', 'UK 07 4543')
  fireEvent(screen.getByLabelText('parkButton'), 'onPress')

  // TRIED TO PARK THE SAME CAR
  fireEvent(screen.getByLabelText('regTextInput'), 'onChangeText', 'UK 07 4543')
  fireEvent(screen.getByLabelText('parkButton'), 'onPress')
  expect(store.getState().parking.numParkedSpaces).toEqual(1);
  expect(Alert.alert).toHaveBeenCalledWith('Error', 'Vehicle with same registration already parked.')

  // PARKED 2nd CAR
  fireEvent(screen.getByLabelText('regTextInput'), 'onChangeText', 'UK 07 4544')
  fireEvent(screen.getByLabelText('parkButton'), 'onPress')
  expect(store.getState().parking.numParkedSpaces).toEqual(2);

  // PARKED 3rd CAR
  fireEvent(screen.getByLabelText('regTextInput'), 'onChangeText', 'UK 07 4545')
  fireEvent(screen.getByLabelText('parkButton'), 'onPress')
  expect(store.getState().parking.numParkedSpaces).toEqual(3);

  // PARKED 4th CAR
  fireEvent(screen.getByLabelText('regTextInput'), 'onChangeText', 'UK 07 4546')
  fireEvent(screen.getByLabelText('parkButton'), 'onPress')
  expect(store.getState().parking.numParkedSpaces).toEqual(4);

  // PARKED 5th CAR
  fireEvent(screen.getByLabelText('regTextInput'), 'onChangeText', 'UK 07 4547')
  fireEvent(screen.getByLabelText('parkButton'), 'onPress')
  expect(store.getState().parking.numParkedSpaces).toEqual(5);
})





