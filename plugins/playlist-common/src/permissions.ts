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

import {
  AuthorizeResult,
  createPermission,
} from '@backstage/plugin-permission-common';
import {
  PLAYLIST_LIST_RESOURCE_TYPE,
  createPlaylistConditionalDecision,
  playlistConditions,
} from './conditions';

const playlistListCreate = createPermission({
  name: 'playlist.list.create',
  attributes: { action: 'create' },
  defaultDecision: { result: AuthorizeResult.ALLOW },
});

const playlistListRead = createPermission({
  name: 'playlist.list.read',
  attributes: { action: 'read' },
  resourceType: PLAYLIST_LIST_RESOURCE_TYPE,
  defaultDecision: createPlaylistConditionalDecision({
    anyOf: [
      playlistConditions.isCurrentUserAnOwner(),
      playlistConditions.isPublic(),
    ],
  }),
});

const playlistListUpdate = createPermission({
  name: 'playlist.list.update',
  attributes: { action: 'update' },
  resourceType: PLAYLIST_LIST_RESOURCE_TYPE,
  defaultDecision: createPlaylistConditionalDecision(
    playlistConditions.isCurrentUserAnOwner(),
  ),
});

const playlistListDelete = createPermission({
  name: 'playlist.list.delete',
  attributes: { action: 'delete' },
  resourceType: PLAYLIST_LIST_RESOURCE_TYPE,
  defaultDecision: createPlaylistConditionalDecision(
    playlistConditions.isCurrentUserAnOwner(),
  ),
});

const playlistFollowersUpdate = createPermission({
  name: 'playlist.followers.update',
  attributes: { action: 'update' },
  resourceType: PLAYLIST_LIST_RESOURCE_TYPE,
  defaultDecision: createPlaylistConditionalDecision(
    playlistConditions.isCurrentUserAnOwner(),
  ),
});

/**
 * @public
 */
export const permissions = {
  playlistListCreate,
  playlistListRead,
  playlistListUpdate,
  playlistListDelete,
  playlistFollowersUpdate,
};
