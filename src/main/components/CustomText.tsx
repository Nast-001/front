import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

interface CustomTextProps extends TextProps {
  variant?: 'regular' | 'bold' | 'italic' | 'boldItalic';
}

export const Text = ({ style, variant = 'regular', ...props }: CustomTextProps) => {
  const variantStyle = {
    regular: globalStyles.text,
    bold: globalStyles.textBold,
    italic: globalStyles.textItalic,
    boldItalic: globalStyles.textBoldItalic,
  }[variant];

  return <RNText style={[variantStyle, style]} {...props} />;
}; 