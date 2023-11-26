import React from 'react';
import renderer from 'react-test-renderer';
import { JSDOM } from "jsdom"

// MagStripe has to do operations on the global document object, so we need to mock it.
const dom = new JSDOM()
global.document = dom.window.document
global.window = dom.window
document = dom.window.document
window = dom.window

import MagStripe from '../src/MagStrip';

let component;
const onComplete = jest.fn();

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  jest.clearAllMocks();

  component = renderer.create(
    <MagStripe onComplete={onComplete} />,
  );
});

afterAll(() => {
  component.unmount();
});

it('should sanely test and mock the dom tree', () => {
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('should call onComplete with correct data when several keys and then the Enter key is pressed', () => {
  let event;
  const compiledKeystrokes = "%B4242424242424242^BLAIR/COLBY               ^23012010000000099000000?;44242424242424242=23012010000009900000?";
  for (let i in compiledKeystrokes) {
    event = new global.window.KeyboardEvent('keydown', { key: compiledKeystrokes[i] });
    document.dispatchEvent(event);
  }
  event = new global.window.KeyboardEvent('keydown', { key: 'Enter' });
  global.document.dispatchEvent(event);
  
  expect(onComplete).toHaveBeenCalledWith({
    card_number: '4242424242424242',
    last_name: 'BLAIR',
    first_name: 'COLBY',
    YY: '23',
    MM: '01',
    service_code: '',
    discretionary_data: ''
  });
});

it('should call onComplete with empty data when just the Enter key is pressed', () => {
  let event;
  event = new global.window.KeyboardEvent('keydown', { key: 'Enter' });
  global.document.dispatchEvent(event);
  
  expect(onComplete).toHaveBeenCalledWith({
    card_number: '',
    last_name: '',
    first_name: '',
    YY: '',
    MM: '',
    service_code: '',
    discretionary_data: ''
  });
});

it('should not call onComplete with only keys entered, no Enter', () => {
  let event;
  const compiledKeystrokes = "%B4242424242424242^BLAIR/COLBY               ^23012010000000099000000?;44242424242424242=23012010000009900000?";
  for (let i in compiledKeystrokes) {
    event = new global.window.KeyboardEvent('keydown', { key: compiledKeystrokes[i] });
    document.dispatchEvent(event);
  }

  
  expect(onComplete.mock.calls.length).toBe(0);
});

it('should call onComplete with paste event', () => {
  let event;
  const text = "%B4242424242424242^BLAIR/COLBY               ^23012010000000099000000?;44242424242424242=23012010000009900000?";
  global.window.clipboardData = { getData: () => text };
  event = new global.window.KeyboardEvent('paste', { });
  global.document.dispatchEvent(event);
  
  expect(onComplete).toHaveBeenCalledWith({
    card_number: '4242424242424242',
    last_name: 'BLAIR',
    first_name: 'COLBY',
    YY: '23',
    MM: '01',
    service_code: '',
    discretionary_data: ''
  });
});