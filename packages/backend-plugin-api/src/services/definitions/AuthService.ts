/*
 * Copyright 2022 The Backstage Authors
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

import { JsonObject } from '@backstage/types';

/**
 * @public
 */
export type BackstageUserPrincipal = {
  type: 'user';

  userEntityRef: string;
};

/**
 * @public
 */
export type BackstageNonePrincipal = {
  type: 'none';
};

/**
 * @public
 */
export type BackstageServicePrincipal = {
  type: 'service';

  // Exact format TBD, possibly 'plugin:<pluginId>' or 'external:<externalServiceId>'
  subject: string;

  /**
   * The scope limitations that apply to this principal.
   *
   * @remarks
   *
   * If no scope is provided the principal is assumed to have unlimited access,
   * at a framework level. The permissions system and individual plugins may or
   * may not still apply additional access controls on top of this.
   */
  scope?: BackstagePrincipalScope;
};

/**
 * The scope limitations that apply to a given principal.
 *
 * @public
 */
export type BackstagePrincipalScope = {
  /**
   * If given, the principal is limited to only having access to these plugins.
   * Can be combined with `permissionAttributes` (particularly in the form of
   * `{action:read}`), but it's superfluous to combine it with `permissionNames`
   * that map to the same plugins.
   *
   * This array always has at least one element, or is missing entirely.
   */
  pluginIds?: string[];
  /**
   * If given, the principal is limited to only performing actions with these
   * named permissions. It's superfluous to combine this with `pluginIds` that
   * map to the same permissions, or with `permissionAttributes`
   *
   * Note that this only applies where permissions checks are enabled in the
   * first place. Endpoints that are not protected by the permissions system at
   * all, are not affected by this setting.
   *
   * This array always has at least one element, or is missing entirely.
   */
  permissionNames?: string[];
  /**
   * If given, the principal is limited to only performing actions whose
   * permissions have these attributes. Typically given in the specific form
   * `{action:read}`. It's superfluous to combine this with `permissionNames`
   * that already have those same attributes.
   *
   * Note that this only applies where permissions checks are enabled in the
   * first place. Endpoints that are not protected by the permissions system at
   * all, are not affected by this setting.
   *
   * This object always has at least one key, or is missing entirely.
   */
  permissionAttributes?: JsonObject;
};

/**
 * @public
 */
export type BackstageCredentials<TPrincipal = unknown> = {
  $$type: '@backstage/BackstageCredentials';

  expiresAt?: Date;

  principal: TPrincipal;
};

/**
 * @public
 */
export type BackstagePrincipalTypes = {
  user: BackstageUserPrincipal;
  service: BackstageServicePrincipal;
  none: BackstageNonePrincipal;
  unknown: unknown;
};

/**
 * @public
 */
export interface AuthService {
  authenticate(
    token: string,
    options?: {
      allowLimitedAccess?: boolean;
    },
  ): Promise<BackstageCredentials>;

  isPrincipal<TType extends keyof BackstagePrincipalTypes>(
    credentials: BackstageCredentials,
    type: TType,
  ): credentials is BackstageCredentials<BackstagePrincipalTypes[TType]>;

  getNoneCredentials(): Promise<BackstageCredentials<BackstageNonePrincipal>>;

  getOwnServiceCredentials(): Promise<
    BackstageCredentials<BackstageServicePrincipal>
  >;

  getPluginRequestToken(options: {
    onBehalfOf: BackstageCredentials;
    targetPluginId: string;
  }): Promise<{ token: string }>;

  getLimitedUserToken(
    credentials: BackstageCredentials<BackstageUserPrincipal>,
  ): Promise<{ token: string; expiresAt: Date }>;

  listPublicServiceKeys(): Promise<{
    keys: JsonObject[];
  }>;
}
