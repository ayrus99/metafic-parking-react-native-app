import { PreloadedState } from '@reduxjs/toolkit'
import { Provider } from 'react-redux';
import { RootState, setupStore } from '../app/store';

import { render } from '@testing-library/react-native';


export const renderWithProviders = (component: any, preloadedState?: PreloadedState<RootState>) => {
  return render(<Provider store={setupStore(preloadedState)}>{component}</Provider>)
}