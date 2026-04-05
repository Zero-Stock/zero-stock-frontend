import { describe, expect, it, vi } from 'vitest';
import { findRouteByPath, renderRoutes, routes } from '@/Routes';

vi.mock('wouter', () => ({
  Route: ({
    path,
    component,
  }: {
    path: string;
    component?: unknown;
  }) => <div data-path={path} data-has-component={Boolean(component)} />,
}));

describe('Routes', () => {
  it('finds nested routes by path', () => {
    expect(findRouteByPath(routes, '/material/create')).toEqual(
      expect.objectContaining({
        path: '/material/create',
        title: 'Create Material',
      }),
    );

    expect(findRouteByPath(routes, '/supplier/:supplierId')).toEqual(
      expect.objectContaining({
        path: '/supplier/:supplierId',
        title: 'Supplier Detail',
      }),
    );
  });

  it('returns undefined for unknown paths', () => {
    expect(findRouteByPath(routes, '/unknown')).toBeUndefined();
  });

  it('renders route elements for top-level and child routes', () => {
    const elements = renderRoutes(routes);

    expect(elements).toHaveLength(12);
    expect(elements.map((element) => element.key)).toContain('/');
    expect(elements.map((element) => element.key)).toContain('/procurement/order');
    expect(elements.map((element) => element.key)).toContain('/supplier/:supplierId');
  });
});
