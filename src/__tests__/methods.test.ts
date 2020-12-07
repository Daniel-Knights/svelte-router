import { setRoutes, route, push, replace, setQuery } from '../router';
import { routes, setParams } from '../router/logic';
import { homeRoute, aboutRoute, blogDefaultChildRoute } from './static/routes';
import { cleanupChildren } from './utils';
import userRoutes from '../routes';

beforeAll(() => setRoutes(userRoutes));

test('Set routes', () => expect(routes).toEqual(userRoutes));

test('Push - Use window.history.pushState to change route', async () => {
    expect(route).toMatchObject(homeRoute);

    await push('/about');

    cleanupChildren();
    expect(route).toMatchObject(aboutRoute);
    expect(window.location.pathname).toBe('/about');

    await push('Home');

    expect(route).toMatchObject(homeRoute);
    expect(window.location.pathname).toBe('/');

    await push({
        path: '/blog',
        params: { id: '1', name: 'dan' },
        query: { test: 'test' },
    });

    cleanupChildren();
    expect(route).toMatchObject(blogDefaultChildRoute);
    expect(route.params).toMatchObject({ id: '1', name: 'dan' });
    expect(route.query).toMatchObject({ test: 'test' });
    expect(window.location.pathname).toBe('/blog/1/dan');
    expect(window.location.search).toBe('?test=test');
});

test('Replace - Use window.history.replaceState to change route', async () => {
    await replace('/about');

    cleanupChildren();
    expect(route).toMatchObject(aboutRoute);

    await replace({
        name: 'Blog',
        params: { id: '1', name: 'dan' },
        query: { test: 'test' },
    });

    cleanupChildren();
    expect(route).toMatchObject(blogDefaultChildRoute);
    expect(route.params).toMatchObject({ id: '1', name: 'dan' });
    expect(route.query).toMatchObject({ test: 'test' });
    expect(window.location.pathname).toBe('/blog/1/dan');
    expect(window.location.search).toBe('?test=test');
});

test('setQuery - Set the current query', () => {
    setQuery({ test: 'test' });

    expect(route.query).toMatchObject({ test: 'test' });
    expect(window.location.search).toBe('?test=test');
});

test('setQuery - Update the current query', () => {
    setQuery({ test: 'test', updated: 'not-updated' });

    expect(window.location.search).toBe('?test=test&updated=not-updated');

    setQuery({ updated: 'updated' }, true);

    expect(route.query).toMatchObject({ test: 'test', updated: 'updated' });
    expect(window.location.search).toBe('?test=test&updated=updated');
});

test('setParams - Set named-params', async () => {
    await push({ path: '/blog', params: { id: '1', name: 'dan' } });

    expect(window.location.pathname).toBe('/blog/1/dan');

    setParams({ id: '2', name: 'John' });

    expect(window.location.pathname).toBe('/blog/2/John');
    expect(route.params).toMatchObject({ id: '2', name: 'John' });
});
