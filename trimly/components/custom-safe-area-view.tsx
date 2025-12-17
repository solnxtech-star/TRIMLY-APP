import { View, StyleSheet, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type CustomSafeAreaViewProps = ViewProps & {
  edges?: 'top' | 'bottom' | 'left' | 'right' | 'all' | 'none';
};

export function CustomSafeAreaView({ 
  style, 
  edges = 'top', 
  children, 
  ...otherProps 
}: CustomSafeAreaViewProps) {
  const insets = useSafeAreaInsets();

  const getEdgeInsets = () => {
    if (edges === 'none') {
      return {};
    }
    
    if (edges === 'all') {
      return {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      };
    }

    const edgeStyles: Record<string, number> = {};
    
    if (edges === 'top' || typeof edges === 'string' && edges.includes('top')) {
      edgeStyles.paddingTop = insets.top;
    }
    
    if (edges === 'bottom' || typeof edges === 'string' && edges.includes('bottom')) {
      edgeStyles.paddingBottom = insets.bottom;
    }
    
    if (edges === 'left' || typeof edges === 'string' && edges.includes('left')) {
      edgeStyles.paddingLeft = insets.left;
    }
    
    if (edges === 'right' || typeof edges === 'string' && edges.includes('right')) {
      edgeStyles.paddingRight = insets.right;
    }
    
    return edgeStyles;
  };

  return (
    <View style={[{ flex: 1 }, getEdgeInsets(), style]} {...otherProps}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});