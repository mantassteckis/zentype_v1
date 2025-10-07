// lib/theme-utils.ts

/**
 * Converts Tailwind gradient class names to inline CSS gradient
 * This ensures gradients work even if Tailwind JIT doesn't compile them
 */
export function gradientToInlineStyle(gradientClasses: string): React.CSSProperties {
  // Parse Tailwind gradient classes like "from-purple-600/40 via-pink-500/40 to-cyan-500/40"
  const colors: string[] = [];
  const stops: string[] = [];
  
  // Extract color stops
  const fromMatch = gradientClasses.match(/from-([\w-]+(?:\/\d+)?)/);
  const viaMatches = gradientClasses.matchAll(/via-([\w-]+(?:\/\d+)?)/g);
  const toMatch = gradientClasses.match(/to-([\w-]+(?:\/\d+)?)/);
  
  if (fromMatch) stops.push(fromMatch[1]);
  for (const match of viaMatches) {
    stops.push(match[1]);
  }
  if (toMatch) stops.push(toMatch[1]);
  
  // Convert Tailwind color names to CSS colors
  const convertColor = (colorName: string): string => {
    // Handle opacity notation (e.g., "purple-600/40")
    const [color, opacity] = colorName.split('/');
    const opacityValue = opacity ? parseInt(opacity) / 100 : 1;
    
    // Color mapping (Tailwind to CSS)
    const colorMap: Record<string, string> = {
      // Standard theme
      'background': 'var(--background)',
      
      // Blues
      'blue-50': 'rgb(239 246 255)',
      'blue-100': 'rgb(219 234 254)',
      'blue-500': 'rgb(59 130 246)',
      'blue-600': 'rgb(37 99 235)',
      'blue-900': 'rgb(30 58 138)',
      
      // Slates
      'slate-900': 'rgb(15 23 42)',
      'slate-950': 'rgb(2 6 23)',
      
      // Emeralds/Teals
      'emerald-900': 'rgb(6 78 59)',
      'teal-800': 'rgb(17 94 89)',
      'teal-900': 'rgb(19 78 74)',
      
      // Purples/Pinks
      'purple-100': 'rgb(243 232 255)',
      'purple-500': 'rgb(168 85 247)',
      'purple-600': 'rgb(147 51 234)',
      'purple-950': 'rgb(59 7 100)',
      'pink-50': 'rgb(253 242 248)',
      'pink-100': 'rgb(252 231 243)',
      'pink-500': 'rgb(236 72 153)',
      'pink-600': 'rgb(219 39 119)',
      
      // Oranges/Reds
      'orange-600': 'rgb(234 88 12)',
      'red-500': 'rgb(239 68 68)',
      
      // Cyans
      'cyan-50': 'rgb(236 254 255)',
      'cyan-500': 'rgb(6 182 212)',
      'cyan-600': 'rgb(8 145 178)',
      
      // Greens
      'green-950': 'rgb(5 46 22)',
      
      // Black
      'black': 'rgb(0 0 0)',
    };
    
    const cssColor = colorMap[color] || color;
    
    // Apply opacity if CSS color is rgb
    if (cssColor.startsWith('rgb(') && opacityValue < 1) {
      return cssColor.replace('rgb(', 'rgba(').replace(')', `, ${opacityValue})`);
    }
    
    // For CSS variables, use them directly
    if (cssColor.startsWith('var(')) {
      return opacityValue < 1 ? `color-mix(in srgb, ${cssColor} ${opacityValue * 100}%, transparent)` : cssColor;
    }
    
    return cssColor;
  };
  
  // Build gradient stops
  const gradientStops = stops.map((stop, index) => {
    const cssColor = convertColor(stop);
    // Distribute stops evenly
    const position = stops.length > 1 ? (index / (stops.length - 1)) * 100 : 50;
    return `${cssColor} ${position}%`;
  }).join(', ');
  
  return {
    backgroundImage: `linear-gradient(to bottom right, ${gradientStops})`,
  };
}

/**
 * Get gradient style for typing area
 */
export function getTypingAreaGradientStyle(gradientClasses: string): React.CSSProperties {
  return gradientToInlineStyle(gradientClasses);
}
