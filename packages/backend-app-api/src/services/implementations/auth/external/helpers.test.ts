/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ConfigReader } from '@backstage/config';
import { internalScopeFromConfig } from './helpers';
import { JsonObject } from '@backstage/types';

describe('internalScopeFromConfig', () => {
  function r(config: JsonObject) {
    return internalScopeFromConfig(new ConfigReader(config));
  }

  it('handles empty / missing scope', () => {
    expect(r({})).toBeUndefined();
    expect(r({ scope: {} })).toBeUndefined();
    expect(r({ scope: { plugins: [] } })).toBeUndefined();
    expect(r({ scope: { permissions: [] } })).toBeUndefined();
    expect(r({ scope: { permissionAttributes: {} } })).toBeUndefined();
  });

  it('handles type errors', () => {
    expect(() => r({ scope: 'hello' })).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'scope' in 'mock-config', got string, wanted object"`,
    );
    expect(() =>
      r({ scope: { unknown: {} } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid key 'unknown' in scope config, expected one of 'plugins', 'permissions', 'permissionAttributes'"`,
    );
    expect(() =>
      r({ scope: { plugins: 'hello' } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'scope.plugins' in 'mock-config', got string, wanted string-array"`,
    );
    expect(() =>
      r({ scope: { plugins: [7] } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'scope.plugins[0]' in 'mock-config', got number, wanted string-array"`,
    );
    expect(() =>
      r({ scope: { permissions: 'hello' } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'scope.permissions' in 'mock-config', got string, wanted string-array"`,
    );
    expect(() =>
      r({ scope: { permissions: [7] } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'scope.permissions[0]' in 'mock-config', got number, wanted string-array"`,
    );
    expect(() =>
      r({ scope: { permissionAttributes: 7 } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'scope.permissionAttributes' in 'mock-config', got number, wanted object"`,
    );
    expect(() =>
      r({ scope: { permissionAttributes: { a: [] } } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid permissionAttributes in scope config, expected all values to be strings"`,
    );
  });

  it('parses valid scope', () => {
    expect(
      r({
        scope: {
          plugins: ['a'],
        },
      }),
    ).toEqual({
      pluginIds: ['a'],
    });

    expect(
      r({
        scope: {
          permissions: ['a'],
        },
      }),
    ).toEqual({
      permissionNames: ['a'],
    });

    expect(
      r({
        scope: {
          permissionAttributes: { a: 'b' },
        },
      }),
    ).toEqual({
      permissionAttributes: { a: 'b' },
    });

    expect(
      r({
        scope: {
          plugins: ['a'],
          permissions: ['a'],
          permissionAttributes: { a: 'b' },
        },
      }),
    ).toEqual({
      pluginIds: ['a'],
      permissionNames: ['a'],
      permissionAttributes: { a: 'b' },
    });
  });
});
