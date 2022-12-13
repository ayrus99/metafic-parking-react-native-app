import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState, AppThunk } from '../../app/store'

type SpaceState = {
  id: string
  registration: string | null
  arrival: Date | null
}

export interface ParkingState {
  spaces: SpaceState[]
  numSpaces: number
  numParkedSpaces: number
}

const initialState: ParkingState = {
  spaces: [],
  numSpaces: 0,
  numParkedSpaces: 0,
}

export const parkingSlice = createSlice({
  name: 'parking',
  initialState,
  reducers: {
    initialize: (state, action: PayloadAction<number>) => {
      for (let index = 0; index < action.payload; index++) {
        state.spaces.push({
          id: index.toString(),
          registration: null,
          arrival: null,
        })
      }
      state.numSpaces = action.payload
    },
    fill: (state, action: PayloadAction<string>) => {
      if (state.numSpaces === state.numParkedSpaces)
        throw new Error('Parking Full')

      let isParked = false
      while (!isParked) {
        const num = getRandomNumber(0, state.spaces.length - 1)
        if (!state.spaces[num].registration) {
          state.spaces[num] = {
            ...state.spaces[num],
            ...{ registration: action.payload, arrival: new Date() },
          }
          isParked = true
          state.numParkedSpaces++
        }
      }
    },
    remove: (state, action: PayloadAction<number>) => {
      state.spaces[action.payload] = {
        id: action.payload.toString(),
        registration: null,
        arrival: null,
      }
      state.numParkedSpaces--
    },
  },
})

export const { initialize, fill, remove } = parkingSlice.actions
export const selectSpaces = (state: RootState) => state.parking.spaces

export default parkingSlice.reducer

//
const getRandomNumber = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
