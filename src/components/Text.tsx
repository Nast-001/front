import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { globalStyles } from '../theme/globalStyles';

interface CustomTextProps extends TextProps {
  italic?: boolean;
}

export const Text: React.FC<CustomTextProps> = ({ style, italic, ...props }) => {
  return (
    <RNText
      style={[
        globalStyles.text,
        italic && globalStyles.textItalic,
        style,
      ]}
      {...props}
    />
  );
}; 