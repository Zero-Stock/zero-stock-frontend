import { isValidElement } from 'react';
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
    const routeKeys = elements
      .filter(isValidElement)
      .map((element) => String(element.key));

    expect(elements).toHaveLength(12);
    expect(routeKeys).toContain('/');
    expect(routeKeys).toContain('/procurement/order');
    expect(routeKeys).toContain('/supplier/:supplierId');
  });
});
