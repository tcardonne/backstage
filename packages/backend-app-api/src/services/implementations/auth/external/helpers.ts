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

import { BackstagePrincipalScope } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { JsonObject } from '@backstage/types';

/**
 * Parses and returns the scope configuration from an `externalAccess` entry, or
 * undefined if there wasn't one.
 *
 * @internal
 */
export function internalScopeFromConfig(
  externalAccessEntryConfig: Config,
): BackstagePrincipalScope | undefined {
  const config = externalAccessEntryConfig.getOptionalConfig('scope');
  if (!config) {
    return undefined;
  }

  const validKeys = ['plugins', 'permissions', 'permissionAttributes'];
  for (const key of config.keys()) {
    if (!validKeys.includes(key)) {
      const valid = validKeys.map(k => `'${k}'`).join(', ');
      throw new Error(
        `Invalid key '${key}' in scope config, expected one of ${valid}`,
      );
    }
  }

  const pluginIds = config.getOptionalStringArray('plugins');
  const permissionNames = config.getOptionalStringArray('permissions');
  const permissionAttributes = config
    .getOptionalConfig('permissionAttributes')
    ?.get<JsonObject>();

  if (
    permissionAttributes &&
    Object.values(permissionAttributes).some(v => typeof v !== 'string')
  ) {
    throw new Error(
      `Invalid permissionAttributes in scope config, expected all values to be strings`,
    );
  }

  const result: BackstagePrincipalScope = {
    ...(pluginIds?.length ? { pluginIds } : {}),
    ...(permissionNames?.length ? { permissionNames } : {}),
    ...(permissionAttributes && Object.keys(permissionAttributes).length
      ? { permissionAttributes }
      : {}),
  };

  if (!Object.keys(result).length) {
    return undefined;
  }

  return result;
}
