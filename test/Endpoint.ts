import { equal, deepEqual } from 'assert';
import assertConsole from './helpers/console.js';
import Endpoint from '../src/classes/Endpoint.js';

describe('Endpoint', () => {
    describe('getRemoteMethod()', () => {
        it('should return a function', () => {
            const endpoint = new Endpoint();
            const method = endpoint.getRemoteMethod('foo');

            equal(typeof method, 'function');
        });

        it('should invoke callRemote when remote method is available', () => {
            const endpoint = new Endpoint();
            const method = endpoint.getRemoteMethod('foo');
            const cb = () => {};
            let callRemoteArgs = null;

            endpoint.setRemoteApi({ '*': ['foo'] });
            endpoint.namespaces['*'].callRemote = (...args) => {
                callRemoteArgs = args;
            };
            method(1, 2, cb);

            deepEqual(callRemoteArgs, ['foo', 1, 2, cb]);
        });

        it('should warn when invoke callRemote and remote method is not available', () => {
            const endpoint = new Endpoint('test');
            const method = endpoint.getRemoteMethod('foo');
            let callRemoteArgs = null;

            endpoint.callRemote = (...args) => {
                callRemoteArgs = args;
            };

            assertConsole(() => {
                method(1, 2);
            }, [
                {
                    type: 'warn',
                    args: ['[rempl] Endpoint#test ns(*) has no available remote method `foo`'],
                },
            ]);
            equal(callRemoteArgs, null);
        });

        it('should update available property on remote API changes', () => {
            const endpoint = new Endpoint();
            const method = endpoint.getRemoteMethod('foo');

            equal(method.available, false);

            endpoint.setRemoteApi({});
            equal(method.available, false);

            endpoint.setRemoteApi({ '*': ['foo'] });
            equal(method.available, true);

            endpoint.setRemoteApi({ '*': ['bar'] });
            equal(method.available, false);

            endpoint.setRemoteApi({ '*': ['bar', 'foo'] });
            equal(method.available, true);

            endpoint.setRemoteApi({});
            equal(method.available, false);

            endpoint.setRemoteApi({ x: ['foo'] });
            equal(method.available, false);
        });
    });
});
