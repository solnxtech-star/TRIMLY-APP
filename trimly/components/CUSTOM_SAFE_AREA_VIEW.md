# CustomSafeAreaView Component

## Overview
The `CustomSafeAreaView` component is a wrapper around the `react-native-safe-area-context` library that provides safe area insets for mobile devices with notches, home indicators, or other UI elements that might overlap with the app content.

This component should be used in all client and business screens to ensure proper spacing at the top of the screen, but should NOT be used in authentication screens.

## Installation
The component is already created and available at `@/components/custom-safe-area-view`. No additional installation is required as `react-native-safe-area-context` is already included in the project dependencies.

## Usage

### Importing the Component
```tsx
import { CustomSafeAreaView } from '@/components/custom-safe-area-view';
```

### Basic Usage
```tsx
<CustomSafeAreaView style={{ flex: 1 }}>
  <YourContent />
</CustomSafeAreaView>
```

### Specifying Edges
By default, the component only applies padding to the top edge. You can customize which edges to apply padding to:

```tsx
// Apply padding to all edges
<CustomSafeAreaView edges="all">
  <YourContent />
</CustomSafeAreaView>

// Apply padding to specific edges
<CustomSafeAreaView edges="top">
  <YourContent />
</CustomSafeAreaView>

// Apply padding to multiple edges
<CustomSafeAreaView edges="top,bottom">
  <YourContent />
</CustomSafeAreaView>
```

### Available Edge Options
- `top` - Apply padding to the top edge (default)
- `bottom` - Apply padding to the bottom edge
- `left` - Apply padding to the left edge
- `right` - Apply padding to the right edge
- `all` - Apply padding to all edges
- `none` - Apply no padding

## Integration Examples
The component has been integrated into the following screens:
- `app/client/home/index.tsx`
- `app/business/dashboard.tsx`

You can follow these examples to integrate the component into other screens.

**Important**: The CustomSafeAreaView should be the root component and should have `flex: 1` style applied to ensure proper layout behavior.

## Styling
The component accepts all standard React Native View props, including `style`, so you can apply additional styling as needed:

```tsx
<CustomSafeAreaView style={{ backgroundColor: '#f0f0f0' }}>
  <YourContent />
</CustomSafeAreaView>
```

## Best Practices
1. Use the component at the root of your screen components to ensure proper spacing
2. Always apply `flex: 1` style to the CustomSafeAreaView to ensure proper layout behavior
3. Adjust the paddingTop value in your screen styles when using CustomSafeAreaView to avoid double spacing
4. Use the `edges` prop to control which sides need safe area padding
5. Test on different device sizes to ensure proper spacing