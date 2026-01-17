import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';

// Тип новых добавляемых пропсов
interface FocusTrackerInjectedProps {
  isFocused: boolean;
  onFocusChange?: (isFocused: boolean) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
}

// Тип колбэков для композиций
type EventHandler = (event: React.FocusEvent) => void;

// Метод для объединения обработчиков событий
function combineEventHandlers(first: EventHandler | undefined, second: EventHandler | undefined): EventHandler | undefined {
  if (!first) return second;
  if (!second) return first;

  return (event) => {
    first(event);
    second(event);
  };
}

// Сам HOC
function withFocusTracker<P extends {}>(
  WrappedComponent: React.ComponentType<P>,
): React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P & FocusTrackerInjectedProps> & React.RefAttributes<HTMLElement>
> {
  const WithFocusTracker = forwardRef<HTMLElement, P & FocusTrackerInjectedProps>(
    (props, ref) => {
      const innerRef = useRef<HTMLElement | null>(null);
      const [isFocused, setIsFocused] = useState(false);

      // Обработчик фокуса
      const handleFocus = (event: React.FocusEvent) => {
        setIsFocused(true);
        props.onFocusChange?.(true);
        props.onFocus?.(event);
      };

      // Обработчик потери фокуса
      const handleBlur = (event: React.FocusEvent) => {
        setIsFocused(false);
        props.onFocusChange?.(false);
        props.onBlur?.(event);
      };

      // Прозрачная передача ref
      useImperativeHandle(ref, () => innerRef.current!, [innerRef]);

      // Соединяем внутренние обработчики с внешними, если они есть
      const composedOnFocus = combineEventHandlers(props.onFocus, handleFocus);
      const composedOnBlur = combineEventHandlers(props.onBlur, handleBlur);

      // Применение обработчиков к компоненту
      const combinedProps = {
        ...props,
        ref: innerRef,
        onFocus: composedOnFocus,
        onBlur: composedOnBlur,
      };

      return <WrappedComponent {...combinedProps as P & FocusTrackerInjectedProps} />;
    },
  );

  return WithFocusTracker;
}

export default withFocusTracker;