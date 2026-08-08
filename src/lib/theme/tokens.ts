import tokens from '../../../design-system/tokens.json';

export type Tokens = typeof tokens;

export function getTokens(): Tokens {
  return tokens;
}

function firstFamilyName(stack: string): string {
  const first = stack.split(',')[0]?.trim() ?? '';
  return first.replace(/^['"]|['"]$/g, '');
}

const GOOGLE_FONT_WEIGHTS = '400;500;600;700;800';

/**
 * Builds a Google Fonts stylesheet URL from whatever family names are set in
 * tokens.json — swapping a font is a tokens.json edit, not a code change.
 * Trade-off: loses next/font's build-time self-hosting/optimization in
 * exchange for the font being genuinely config-driven at runtime.
 */
export function googleFontsHref(t: Tokens = tokens): string {
  const families = Array.from(
    new Set(
      [t.typography.fontFamily.heading, t.typography.fontFamily.body, t.typography.fontFamily.mono]
        .map(firstFamilyName)
        .filter(Boolean)
    )
  );
  const params = families
    .map((name) => `family=${encodeURIComponent(name).replace(/%20/g, '+')}:wght@${GOOGLE_FONT_WEIGHTS}`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

/**
 * Renders tokens.json into a flat block of CSS custom-property declarations.
 * This is the single place a token value becomes a live CSS variable — every
 * component and the admin dashboard read colors/fonts/radii through these
 * variables, never a literal value.
 */
export function buildRootCssVariables(t: Tokens = tokens): string {
  const c = t.colors;
  const type = t.typography;
  return `
--brand-primary: ${c.brand.primary};
--brand-secondary: ${c.brand.secondary};
--brand-accent: ${c.brand.accent};
--brand-highlight: ${c.brand.highlight};

--neutral-50: ${c.neutral['50']};
--neutral-100: ${c.neutral['100']};
--neutral-200: ${c.neutral['200']};
--neutral-300: ${c.neutral['300']};
--neutral-400: ${c.neutral['400']};
--neutral-500: ${c.neutral['500']};
--neutral-600: ${c.neutral['600']};
--neutral-700: ${c.neutral['700']};
--neutral-800: ${c.neutral['800']};
--neutral-900: ${c.neutral['900']};
--neutral-950: ${c.neutral['950']};

--color-success: ${c.semantic.success};
--color-warning: ${c.semantic.warning};
--color-error: ${c.semantic.error};
--color-info: ${c.semantic.info};

--surface-page: ${c.surface.page};
--surface-card: ${c.surface.card};
--surface-elevated: ${c.surface.elevated};
--surface-overlay: ${c.surface.overlay};

--background: var(--surface-page);
--foreground: var(--neutral-100);

--font-sans: ${type.fontFamily.body};
--font-heading: ${type.fontFamily.heading};
--font-mono: ${type.fontFamily.mono};

--radius-sm: ${t.borderRadius.sm};
--radius-md: ${t.borderRadius.md};
--radius-lg: ${t.borderRadius.lg};
--radius-xl: ${t.borderRadius.xl};
--radius-2xl: ${t.borderRadius['2xl']};
--radius-3xl: ${t.borderRadius['3xl']};

--shadow-sm: ${t.shadows.sm};
--shadow-md: ${t.shadows.md};
--shadow-lg: ${t.shadows.lg};

--animate-duration-fast: ${t.animation.duration.fast};
--animate-duration-normal: ${t.animation.duration.normal};
--animate-duration-slow: ${t.animation.duration.slow};
--ease-default: ${t.animation.easing.default};
`.trim();
}
