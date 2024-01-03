type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export function getCurrentBreakpoint(): Breakpoint {
  // The 'xs' breakpoint is assumed to be from 0px up to the first specified breakpoint.
  if (window.matchMedia('(max-width: 639px)').matches) return 'xs';
  if (window.matchMedia('(min-width: 640px) and (max-width: 767px)').matches) return 'sm';
  if (window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches) return 'md';
  if (window.matchMedia('(min-width: 1024px) and (max-width: 1279px)').matches) return 'lg';
  if (window.matchMedia('(min-width: 1280px) and (max-width: 1535px)').matches) return 'xl';
  if (window.matchMedia('(min-width: 1536px)').matches) return '2xl';

  // Return 'xs' as default, though in practice one of the above should always match
  return 'xs';
}
