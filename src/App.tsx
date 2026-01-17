import React, { useState } from 'react';
import Input from './components/Input';
import withFocusTracker from './hoc/withFocusTracker';

// Оборачиваем Input HOC
const InputWithFocusTracker = withFocusTracker(Input);

function App() {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <>
      <InputWithFocusTracker
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocusChange={setFocused}
        onFocus={(e) => console.log('Focused:', e.target.value)}
        onBlur={(e) => console.log('Blurred:', e.target.value)}
      />
      <p>Фокус: {focused ? 'Да' : 'Нет'}</p>
    </>
  );
}

export default App;