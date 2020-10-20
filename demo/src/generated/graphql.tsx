import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  json: any;
  jsonb: any;
  timestamptz: any;
  uuid: any;
};

export type DemoLogInInput = {
  spotify_authorization_code: Scalars['String'];
};

export type DemoLogInOutput = {
  __typename?: 'DemoLogInOutput';
  access_token: Scalars['String'];
};

/** expression to compare columns of type Int. All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: Maybe<Scalars['Int']>;
  _gt?: Maybe<Scalars['Int']>;
  _gte?: Maybe<Scalars['Int']>;
  _in?: Maybe<Array<Scalars['Int']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['Int']>;
  _lte?: Maybe<Scalars['Int']>;
  _neq?: Maybe<Scalars['Int']>;
  _nin?: Maybe<Array<Scalars['Int']>>;
};

/** expression to compare columns of type String. All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: Maybe<Scalars['String']>;
  _gt?: Maybe<Scalars['String']>;
  _gte?: Maybe<Scalars['String']>;
  _ilike?: Maybe<Scalars['String']>;
  _in?: Maybe<Array<Scalars['String']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _like?: Maybe<Scalars['String']>;
  _lt?: Maybe<Scalars['String']>;
  _lte?: Maybe<Scalars['String']>;
  _neq?: Maybe<Scalars['String']>;
  _nilike?: Maybe<Scalars['String']>;
  _nin?: Maybe<Array<Scalars['String']>>;
  _nlike?: Maybe<Scalars['String']>;
  _nsimilar?: Maybe<Scalars['String']>;
  _similar?: Maybe<Scalars['String']>;
};


/** expression to compare columns of type json. All fields are combined with logical 'AND'. */
export type Json_Comparison_Exp = {
  _eq?: Maybe<Scalars['json']>;
  _gt?: Maybe<Scalars['json']>;
  _gte?: Maybe<Scalars['json']>;
  _in?: Maybe<Array<Scalars['json']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['json']>;
  _lte?: Maybe<Scalars['json']>;
  _neq?: Maybe<Scalars['json']>;
  _nin?: Maybe<Array<Scalars['json']>>;
};


/** expression to compare columns of type jsonb. All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  /** is the column contained in the given json value */
  _contained_in?: Maybe<Scalars['jsonb']>;
  /** does the column contain the given json value at the top level */
  _contains?: Maybe<Scalars['jsonb']>;
  _eq?: Maybe<Scalars['jsonb']>;
  _gt?: Maybe<Scalars['jsonb']>;
  _gte?: Maybe<Scalars['jsonb']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: Maybe<Scalars['String']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: Maybe<Array<Scalars['String']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: Maybe<Array<Scalars['String']>>;
  _in?: Maybe<Array<Scalars['jsonb']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['jsonb']>;
  _lte?: Maybe<Scalars['jsonb']>;
  _neq?: Maybe<Scalars['jsonb']>;
  _nin?: Maybe<Array<Scalars['jsonb']>>;
};

/** columns and relationships of "library_sync_statuses" */
export type Library_Sync_Statuses = {
  __typename?: 'library_sync_statuses';
  comment?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

/** aggregated selection of "library_sync_statuses" */
export type Library_Sync_Statuses_Aggregate = {
  __typename?: 'library_sync_statuses_aggregate';
  aggregate?: Maybe<Library_Sync_Statuses_Aggregate_Fields>;
  nodes: Array<Library_Sync_Statuses>;
};

/** aggregate fields of "library_sync_statuses" */
export type Library_Sync_Statuses_Aggregate_Fields = {
  __typename?: 'library_sync_statuses_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Library_Sync_Statuses_Max_Fields>;
  min?: Maybe<Library_Sync_Statuses_Min_Fields>;
};


/** aggregate fields of "library_sync_statuses" */
export type Library_Sync_Statuses_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Library_Sync_Statuses_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "library_sync_statuses" */
export type Library_Sync_Statuses_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Library_Sync_Statuses_Max_Order_By>;
  min?: Maybe<Library_Sync_Statuses_Min_Order_By>;
};

/** input type for inserting array relation for remote table "library_sync_statuses" */
export type Library_Sync_Statuses_Arr_Rel_Insert_Input = {
  data: Array<Library_Sync_Statuses_Insert_Input>;
  on_conflict?: Maybe<Library_Sync_Statuses_On_Conflict>;
};

/** Boolean expression to filter rows from the table "library_sync_statuses". All fields are combined with a logical 'AND'. */
export type Library_Sync_Statuses_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Library_Sync_Statuses_Bool_Exp>>>;
  _not?: Maybe<Library_Sync_Statuses_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Library_Sync_Statuses_Bool_Exp>>>;
  comment?: Maybe<String_Comparison_Exp>;
  value?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "library_sync_statuses" */
export enum Library_Sync_Statuses_Constraint {
  /** unique or primary key constraint */
  LibrarySyncStatusesPkey = 'library_sync_statuses_pkey'
}

export enum Library_Sync_Statuses_Enum {
  /** adding grouped tracks to actual spotify playlists */
  AddingTracks = 'adding_tracks',
  /** creating the inital spotify playlists to populate with tracks */
  CreatingPlaylists = 'creating_playlists',
  /** sync cannot start until refresh_token is added */
  PendingRefreshToken = 'pending_refresh_token',
  /** scanning through user\s tracks and grouping them into playlists */
  ScanningLibrary = 'scanning_library',
  /** the library sync succeeded */
  Succeeded = 'succeeded'
}

/** expression to compare columns of type library_sync_statuses_enum. All fields are combined with logical 'AND'. */
export type Library_Sync_Statuses_Enum_Comparison_Exp = {
  _eq?: Maybe<Library_Sync_Statuses_Enum>;
  _in?: Maybe<Array<Library_Sync_Statuses_Enum>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<Library_Sync_Statuses_Enum>;
  _nin?: Maybe<Array<Library_Sync_Statuses_Enum>>;
};

/** input type for inserting data into table "library_sync_statuses" */
export type Library_Sync_Statuses_Insert_Input = {
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Library_Sync_Statuses_Max_Fields = {
  __typename?: 'library_sync_statuses_max_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "library_sync_statuses" */
export type Library_Sync_Statuses_Max_Order_By = {
  comment?: Maybe<Order_By>;
  value?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Library_Sync_Statuses_Min_Fields = {
  __typename?: 'library_sync_statuses_min_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "library_sync_statuses" */
export type Library_Sync_Statuses_Min_Order_By = {
  comment?: Maybe<Order_By>;
  value?: Maybe<Order_By>;
};

/** response of any mutation on the table "library_sync_statuses" */
export type Library_Sync_Statuses_Mutation_Response = {
  __typename?: 'library_sync_statuses_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Library_Sync_Statuses>;
};

/** input type for inserting object relation for remote table "library_sync_statuses" */
export type Library_Sync_Statuses_Obj_Rel_Insert_Input = {
  data: Library_Sync_Statuses_Insert_Input;
  on_conflict?: Maybe<Library_Sync_Statuses_On_Conflict>;
};

/** on conflict condition type for table "library_sync_statuses" */
export type Library_Sync_Statuses_On_Conflict = {
  constraint: Library_Sync_Statuses_Constraint;
  update_columns: Array<Library_Sync_Statuses_Update_Column>;
  where?: Maybe<Library_Sync_Statuses_Bool_Exp>;
};

/** ordering options when selecting data from "library_sync_statuses" */
export type Library_Sync_Statuses_Order_By = {
  comment?: Maybe<Order_By>;
  value?: Maybe<Order_By>;
};

/** primary key columns input for table: "library_sync_statuses" */
export type Library_Sync_Statuses_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "library_sync_statuses" */
export enum Library_Sync_Statuses_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "library_sync_statuses" */
export type Library_Sync_Statuses_Set_Input = {
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** update columns of table "library_sync_statuses" */
export enum Library_Sync_Statuses_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** perform the action: "DemoLogIn" */
  DemoLogIn?: Maybe<DemoLogInOutput>;
  /** delete data from the table: "library_sync_statuses" */
  delete_library_sync_statuses?: Maybe<Library_Sync_Statuses_Mutation_Response>;
  /** delete single row from the table: "library_sync_statuses" */
  delete_library_sync_statuses_by_pk?: Maybe<Library_Sync_Statuses>;
  /** delete data from the table: "playlist_track_statuses" */
  delete_playlist_track_statuses?: Maybe<Playlist_Track_Statuses_Mutation_Response>;
  /** delete single row from the table: "playlist_track_statuses" */
  delete_playlist_track_statuses_by_pk?: Maybe<Playlist_Track_Statuses>;
  /** delete data from the table: "playlist_tracks" */
  delete_playlist_tracks?: Maybe<Playlist_Tracks_Mutation_Response>;
  /** delete single row from the table: "playlist_tracks" */
  delete_playlist_tracks_by_pk?: Maybe<Playlist_Tracks>;
  /** delete data from the table: "playlists" */
  delete_playlists?: Maybe<Playlists_Mutation_Response>;
  /** delete single row from the table: "playlists" */
  delete_playlists_by_pk?: Maybe<Playlists>;
  /** delete data from the table: "stride_event_types" */
  delete_stride_event_types?: Maybe<Stride_Event_Types_Mutation_Response>;
  /** delete single row from the table: "stride_event_types" */
  delete_stride_event_types_by_pk?: Maybe<Stride_Event_Types>;
  /** delete data from the table: "stride_events" */
  delete_stride_events?: Maybe<Stride_Events_Mutation_Response>;
  /** delete single row from the table: "stride_events" */
  delete_stride_events_by_pk?: Maybe<Stride_Events>;
  /** delete data from the table: "users" */
  delete_users?: Maybe<Users_Mutation_Response>;
  /** delete single row from the table: "users" */
  delete_users_by_pk?: Maybe<Users>;
  /** insert data into the table: "library_sync_statuses" */
  insert_library_sync_statuses?: Maybe<Library_Sync_Statuses_Mutation_Response>;
  /** insert a single row into the table: "library_sync_statuses" */
  insert_library_sync_statuses_one?: Maybe<Library_Sync_Statuses>;
  /** insert data into the table: "playlist_track_statuses" */
  insert_playlist_track_statuses?: Maybe<Playlist_Track_Statuses_Mutation_Response>;
  /** insert a single row into the table: "playlist_track_statuses" */
  insert_playlist_track_statuses_one?: Maybe<Playlist_Track_Statuses>;
  /** insert data into the table: "playlist_tracks" */
  insert_playlist_tracks?: Maybe<Playlist_Tracks_Mutation_Response>;
  /** insert a single row into the table: "playlist_tracks" */
  insert_playlist_tracks_one?: Maybe<Playlist_Tracks>;
  /** insert data into the table: "playlists" */
  insert_playlists?: Maybe<Playlists_Mutation_Response>;
  /** insert a single row into the table: "playlists" */
  insert_playlists_one?: Maybe<Playlists>;
  /** insert data into the table: "stride_event_types" */
  insert_stride_event_types?: Maybe<Stride_Event_Types_Mutation_Response>;
  /** insert a single row into the table: "stride_event_types" */
  insert_stride_event_types_one?: Maybe<Stride_Event_Types>;
  /** insert data into the table: "stride_events" */
  insert_stride_events?: Maybe<Stride_Events_Mutation_Response>;
  /** insert a single row into the table: "stride_events" */
  insert_stride_events_one?: Maybe<Stride_Events>;
  /** insert data into the table: "users" */
  insert_users?: Maybe<Users_Mutation_Response>;
  /** insert a single row into the table: "users" */
  insert_users_one?: Maybe<Users>;
  /** update data of the table: "library_sync_statuses" */
  update_library_sync_statuses?: Maybe<Library_Sync_Statuses_Mutation_Response>;
  /** update single row of the table: "library_sync_statuses" */
  update_library_sync_statuses_by_pk?: Maybe<Library_Sync_Statuses>;
  /** update data of the table: "playlist_track_statuses" */
  update_playlist_track_statuses?: Maybe<Playlist_Track_Statuses_Mutation_Response>;
  /** update single row of the table: "playlist_track_statuses" */
  update_playlist_track_statuses_by_pk?: Maybe<Playlist_Track_Statuses>;
  /** update data of the table: "playlist_tracks" */
  update_playlist_tracks?: Maybe<Playlist_Tracks_Mutation_Response>;
  /** update single row of the table: "playlist_tracks" */
  update_playlist_tracks_by_pk?: Maybe<Playlist_Tracks>;
  /** update data of the table: "playlists" */
  update_playlists?: Maybe<Playlists_Mutation_Response>;
  /** update single row of the table: "playlists" */
  update_playlists_by_pk?: Maybe<Playlists>;
  /** update data of the table: "stride_event_types" */
  update_stride_event_types?: Maybe<Stride_Event_Types_Mutation_Response>;
  /** update single row of the table: "stride_event_types" */
  update_stride_event_types_by_pk?: Maybe<Stride_Event_Types>;
  /** update data of the table: "stride_events" */
  update_stride_events?: Maybe<Stride_Events_Mutation_Response>;
  /** update single row of the table: "stride_events" */
  update_stride_events_by_pk?: Maybe<Stride_Events>;
  /** update data of the table: "users" */
  update_users?: Maybe<Users_Mutation_Response>;
  /** update single row of the table: "users" */
  update_users_by_pk?: Maybe<Users>;
};


/** mutation root */
export type Mutation_RootDemoLogInArgs = {
  args: DemoLogInInput;
};


/** mutation root */
export type Mutation_RootDelete_Library_Sync_StatusesArgs = {
  where: Library_Sync_Statuses_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Library_Sync_Statuses_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Playlist_Track_StatusesArgs = {
  where: Playlist_Track_Statuses_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Playlist_Track_Statuses_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Playlist_TracksArgs = {
  where: Playlist_Tracks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Playlist_Tracks_By_PkArgs = {
  playlist_id: Scalars['Int'];
  spotify_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_PlaylistsArgs = {
  where: Playlists_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Playlists_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_Stride_Event_TypesArgs = {
  where: Stride_Event_Types_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Stride_Event_Types_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Stride_EventsArgs = {
  where: Stride_Events_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Stride_Events_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_UsersArgs = {
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootInsert_Library_Sync_StatusesArgs = {
  objects: Array<Library_Sync_Statuses_Insert_Input>;
  on_conflict?: Maybe<Library_Sync_Statuses_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Library_Sync_Statuses_OneArgs = {
  object: Library_Sync_Statuses_Insert_Input;
  on_conflict?: Maybe<Library_Sync_Statuses_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Playlist_Track_StatusesArgs = {
  objects: Array<Playlist_Track_Statuses_Insert_Input>;
  on_conflict?: Maybe<Playlist_Track_Statuses_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Playlist_Track_Statuses_OneArgs = {
  object: Playlist_Track_Statuses_Insert_Input;
  on_conflict?: Maybe<Playlist_Track_Statuses_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Playlist_TracksArgs = {
  objects: Array<Playlist_Tracks_Insert_Input>;
  on_conflict?: Maybe<Playlist_Tracks_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Playlist_Tracks_OneArgs = {
  object: Playlist_Tracks_Insert_Input;
  on_conflict?: Maybe<Playlist_Tracks_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_PlaylistsArgs = {
  objects: Array<Playlists_Insert_Input>;
  on_conflict?: Maybe<Playlists_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Playlists_OneArgs = {
  object: Playlists_Insert_Input;
  on_conflict?: Maybe<Playlists_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Stride_Event_TypesArgs = {
  objects: Array<Stride_Event_Types_Insert_Input>;
  on_conflict?: Maybe<Stride_Event_Types_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Stride_Event_Types_OneArgs = {
  object: Stride_Event_Types_Insert_Input;
  on_conflict?: Maybe<Stride_Event_Types_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Stride_EventsArgs = {
  objects: Array<Stride_Events_Insert_Input>;
  on_conflict?: Maybe<Stride_Events_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Stride_Events_OneArgs = {
  object: Stride_Events_Insert_Input;
  on_conflict?: Maybe<Stride_Events_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UsersArgs = {
  objects: Array<Users_Insert_Input>;
  on_conflict?: Maybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_OneArgs = {
  object: Users_Insert_Input;
  on_conflict?: Maybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_Library_Sync_StatusesArgs = {
  _set?: Maybe<Library_Sync_Statuses_Set_Input>;
  where: Library_Sync_Statuses_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Library_Sync_Statuses_By_PkArgs = {
  _set?: Maybe<Library_Sync_Statuses_Set_Input>;
  pk_columns: Library_Sync_Statuses_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Playlist_Track_StatusesArgs = {
  _set?: Maybe<Playlist_Track_Statuses_Set_Input>;
  where: Playlist_Track_Statuses_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Playlist_Track_Statuses_By_PkArgs = {
  _set?: Maybe<Playlist_Track_Statuses_Set_Input>;
  pk_columns: Playlist_Track_Statuses_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Playlist_TracksArgs = {
  _inc?: Maybe<Playlist_Tracks_Inc_Input>;
  _set?: Maybe<Playlist_Tracks_Set_Input>;
  where: Playlist_Tracks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Playlist_Tracks_By_PkArgs = {
  _inc?: Maybe<Playlist_Tracks_Inc_Input>;
  _set?: Maybe<Playlist_Tracks_Set_Input>;
  pk_columns: Playlist_Tracks_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_PlaylistsArgs = {
  _inc?: Maybe<Playlists_Inc_Input>;
  _set?: Maybe<Playlists_Set_Input>;
  where: Playlists_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Playlists_By_PkArgs = {
  _inc?: Maybe<Playlists_Inc_Input>;
  _set?: Maybe<Playlists_Set_Input>;
  pk_columns: Playlists_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Stride_Event_TypesArgs = {
  _set?: Maybe<Stride_Event_Types_Set_Input>;
  where: Stride_Event_Types_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Stride_Event_Types_By_PkArgs = {
  _set?: Maybe<Stride_Event_Types_Set_Input>;
  pk_columns: Stride_Event_Types_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Stride_EventsArgs = {
  _append?: Maybe<Stride_Events_Append_Input>;
  _delete_at_path?: Maybe<Stride_Events_Delete_At_Path_Input>;
  _delete_elem?: Maybe<Stride_Events_Delete_Elem_Input>;
  _delete_key?: Maybe<Stride_Events_Delete_Key_Input>;
  _inc?: Maybe<Stride_Events_Inc_Input>;
  _prepend?: Maybe<Stride_Events_Prepend_Input>;
  _set?: Maybe<Stride_Events_Set_Input>;
  where: Stride_Events_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Stride_Events_By_PkArgs = {
  _append?: Maybe<Stride_Events_Append_Input>;
  _delete_at_path?: Maybe<Stride_Events_Delete_At_Path_Input>;
  _delete_elem?: Maybe<Stride_Events_Delete_Elem_Input>;
  _delete_key?: Maybe<Stride_Events_Delete_Key_Input>;
  _inc?: Maybe<Stride_Events_Inc_Input>;
  _prepend?: Maybe<Stride_Events_Prepend_Input>;
  _set?: Maybe<Stride_Events_Set_Input>;
  pk_columns: Stride_Events_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_UsersArgs = {
  _inc?: Maybe<Users_Inc_Input>;
  _set?: Maybe<Users_Set_Input>;
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_By_PkArgs = {
  _inc?: Maybe<Users_Inc_Input>;
  _set?: Maybe<Users_Set_Input>;
  pk_columns: Users_Pk_Columns_Input;
};

/** column ordering options */
export enum Order_By {
  /** in the ascending order, nulls last */
  Asc = 'asc',
  /** in the ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in the ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in the descending order, nulls first */
  Desc = 'desc',
  /** in the descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in the descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/** columns and relationships of "playlist_track_statuses" */
export type Playlist_Track_Statuses = {
  __typename?: 'playlist_track_statuses';
  comment?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

/** aggregated selection of "playlist_track_statuses" */
export type Playlist_Track_Statuses_Aggregate = {
  __typename?: 'playlist_track_statuses_aggregate';
  aggregate?: Maybe<Playlist_Track_Statuses_Aggregate_Fields>;
  nodes: Array<Playlist_Track_Statuses>;
};

/** aggregate fields of "playlist_track_statuses" */
export type Playlist_Track_Statuses_Aggregate_Fields = {
  __typename?: 'playlist_track_statuses_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Playlist_Track_Statuses_Max_Fields>;
  min?: Maybe<Playlist_Track_Statuses_Min_Fields>;
};


/** aggregate fields of "playlist_track_statuses" */
export type Playlist_Track_Statuses_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Playlist_Track_Statuses_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "playlist_track_statuses" */
export type Playlist_Track_Statuses_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Playlist_Track_Statuses_Max_Order_By>;
  min?: Maybe<Playlist_Track_Statuses_Min_Order_By>;
};

/** input type for inserting array relation for remote table "playlist_track_statuses" */
export type Playlist_Track_Statuses_Arr_Rel_Insert_Input = {
  data: Array<Playlist_Track_Statuses_Insert_Input>;
  on_conflict?: Maybe<Playlist_Track_Statuses_On_Conflict>;
};

/** Boolean expression to filter rows from the table "playlist_track_statuses". All fields are combined with a logical 'AND'. */
export type Playlist_Track_Statuses_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Playlist_Track_Statuses_Bool_Exp>>>;
  _not?: Maybe<Playlist_Track_Statuses_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Playlist_Track_Statuses_Bool_Exp>>>;
  comment?: Maybe<String_Comparison_Exp>;
  value?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "playlist_track_statuses" */
export enum Playlist_Track_Statuses_Constraint {
  /** unique or primary key constraint */
  PlaylistTrackStatusesPkey = 'playlist_track_statuses_pkey'
}

export enum Playlist_Track_Statuses_Enum {
  /** track has been added to the spotify playlist */
  Added = 'added',
  /** track is ready to be added to the spotify playlist */
  PendingAdd = 'pending_add'
}

/** expression to compare columns of type playlist_track_statuses_enum. All fields are combined with logical 'AND'. */
export type Playlist_Track_Statuses_Enum_Comparison_Exp = {
  _eq?: Maybe<Playlist_Track_Statuses_Enum>;
  _in?: Maybe<Array<Playlist_Track_Statuses_Enum>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<Playlist_Track_Statuses_Enum>;
  _nin?: Maybe<Array<Playlist_Track_Statuses_Enum>>;
};

/** input type for inserting data into table "playlist_track_statuses" */
export type Playlist_Track_Statuses_Insert_Input = {
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Playlist_Track_Statuses_Max_Fields = {
  __typename?: 'playlist_track_statuses_max_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "playlist_track_statuses" */
export type Playlist_Track_Statuses_Max_Order_By = {
  comment?: Maybe<Order_By>;
  value?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Playlist_Track_Statuses_Min_Fields = {
  __typename?: 'playlist_track_statuses_min_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "playlist_track_statuses" */
export type Playlist_Track_Statuses_Min_Order_By = {
  comment?: Maybe<Order_By>;
  value?: Maybe<Order_By>;
};

/** response of any mutation on the table "playlist_track_statuses" */
export type Playlist_Track_Statuses_Mutation_Response = {
  __typename?: 'playlist_track_statuses_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Playlist_Track_Statuses>;
};

/** input type for inserting object relation for remote table "playlist_track_statuses" */
export type Playlist_Track_Statuses_Obj_Rel_Insert_Input = {
  data: Playlist_Track_Statuses_Insert_Input;
  on_conflict?: Maybe<Playlist_Track_Statuses_On_Conflict>;
};

/** on conflict condition type for table "playlist_track_statuses" */
export type Playlist_Track_Statuses_On_Conflict = {
  constraint: Playlist_Track_Statuses_Constraint;
  update_columns: Array<Playlist_Track_Statuses_Update_Column>;
  where?: Maybe<Playlist_Track_Statuses_Bool_Exp>;
};

/** ordering options when selecting data from "playlist_track_statuses" */
export type Playlist_Track_Statuses_Order_By = {
  comment?: Maybe<Order_By>;
  value?: Maybe<Order_By>;
};

/** primary key columns input for table: "playlist_track_statuses" */
export type Playlist_Track_Statuses_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "playlist_track_statuses" */
export enum Playlist_Track_Statuses_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "playlist_track_statuses" */
export type Playlist_Track_Statuses_Set_Input = {
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** update columns of table "playlist_track_statuses" */
export enum Playlist_Track_Statuses_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** columns and relationships of "playlist_tracks" */
export type Playlist_Tracks = {
  __typename?: 'playlist_tracks';
  created_at: Scalars['timestamptz'];
  /** An object relationship */
  playlist: Playlists;
  playlist_id: Scalars['Int'];
  spotify_id: Scalars['String'];
  status: Playlist_Track_Statuses_Enum;
  updated_at: Scalars['timestamptz'];
};

/** aggregated selection of "playlist_tracks" */
export type Playlist_Tracks_Aggregate = {
  __typename?: 'playlist_tracks_aggregate';
  aggregate?: Maybe<Playlist_Tracks_Aggregate_Fields>;
  nodes: Array<Playlist_Tracks>;
};

/** aggregate fields of "playlist_tracks" */
export type Playlist_Tracks_Aggregate_Fields = {
  __typename?: 'playlist_tracks_aggregate_fields';
  avg?: Maybe<Playlist_Tracks_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Playlist_Tracks_Max_Fields>;
  min?: Maybe<Playlist_Tracks_Min_Fields>;
  stddev?: Maybe<Playlist_Tracks_Stddev_Fields>;
  stddev_pop?: Maybe<Playlist_Tracks_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Playlist_Tracks_Stddev_Samp_Fields>;
  sum?: Maybe<Playlist_Tracks_Sum_Fields>;
  var_pop?: Maybe<Playlist_Tracks_Var_Pop_Fields>;
  var_samp?: Maybe<Playlist_Tracks_Var_Samp_Fields>;
  variance?: Maybe<Playlist_Tracks_Variance_Fields>;
};


/** aggregate fields of "playlist_tracks" */
export type Playlist_Tracks_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Playlist_Tracks_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "playlist_tracks" */
export type Playlist_Tracks_Aggregate_Order_By = {
  avg?: Maybe<Playlist_Tracks_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Playlist_Tracks_Max_Order_By>;
  min?: Maybe<Playlist_Tracks_Min_Order_By>;
  stddev?: Maybe<Playlist_Tracks_Stddev_Order_By>;
  stddev_pop?: Maybe<Playlist_Tracks_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Playlist_Tracks_Stddev_Samp_Order_By>;
  sum?: Maybe<Playlist_Tracks_Sum_Order_By>;
  var_pop?: Maybe<Playlist_Tracks_Var_Pop_Order_By>;
  var_samp?: Maybe<Playlist_Tracks_Var_Samp_Order_By>;
  variance?: Maybe<Playlist_Tracks_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "playlist_tracks" */
export type Playlist_Tracks_Arr_Rel_Insert_Input = {
  data: Array<Playlist_Tracks_Insert_Input>;
  on_conflict?: Maybe<Playlist_Tracks_On_Conflict>;
};

/** aggregate avg on columns */
export type Playlist_Tracks_Avg_Fields = {
  __typename?: 'playlist_tracks_avg_fields';
  playlist_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "playlist_tracks" */
export type Playlist_Tracks_Avg_Order_By = {
  playlist_id?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "playlist_tracks". All fields are combined with a logical 'AND'. */
export type Playlist_Tracks_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Playlist_Tracks_Bool_Exp>>>;
  _not?: Maybe<Playlist_Tracks_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Playlist_Tracks_Bool_Exp>>>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  playlist?: Maybe<Playlists_Bool_Exp>;
  playlist_id?: Maybe<Int_Comparison_Exp>;
  spotify_id?: Maybe<String_Comparison_Exp>;
  status?: Maybe<Playlist_Track_Statuses_Enum_Comparison_Exp>;
  updated_at?: Maybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "playlist_tracks" */
export enum Playlist_Tracks_Constraint {
  /** unique or primary key constraint */
  PlaylistTracksPkey = 'playlist_tracks_pkey'
}

/** input type for incrementing integer column in table "playlist_tracks" */
export type Playlist_Tracks_Inc_Input = {
  playlist_id?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "playlist_tracks" */
export type Playlist_Tracks_Insert_Input = {
  created_at?: Maybe<Scalars['timestamptz']>;
  playlist?: Maybe<Playlists_Obj_Rel_Insert_Input>;
  playlist_id?: Maybe<Scalars['Int']>;
  spotify_id?: Maybe<Scalars['String']>;
  status?: Maybe<Playlist_Track_Statuses_Enum>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Playlist_Tracks_Max_Fields = {
  __typename?: 'playlist_tracks_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  playlist_id?: Maybe<Scalars['Int']>;
  spotify_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "playlist_tracks" */
export type Playlist_Tracks_Max_Order_By = {
  created_at?: Maybe<Order_By>;
  playlist_id?: Maybe<Order_By>;
  spotify_id?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Playlist_Tracks_Min_Fields = {
  __typename?: 'playlist_tracks_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  playlist_id?: Maybe<Scalars['Int']>;
  spotify_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "playlist_tracks" */
export type Playlist_Tracks_Min_Order_By = {
  created_at?: Maybe<Order_By>;
  playlist_id?: Maybe<Order_By>;
  spotify_id?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
};

/** response of any mutation on the table "playlist_tracks" */
export type Playlist_Tracks_Mutation_Response = {
  __typename?: 'playlist_tracks_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Playlist_Tracks>;
};

/** input type for inserting object relation for remote table "playlist_tracks" */
export type Playlist_Tracks_Obj_Rel_Insert_Input = {
  data: Playlist_Tracks_Insert_Input;
  on_conflict?: Maybe<Playlist_Tracks_On_Conflict>;
};

/** on conflict condition type for table "playlist_tracks" */
export type Playlist_Tracks_On_Conflict = {
  constraint: Playlist_Tracks_Constraint;
  update_columns: Array<Playlist_Tracks_Update_Column>;
  where?: Maybe<Playlist_Tracks_Bool_Exp>;
};

/** ordering options when selecting data from "playlist_tracks" */
export type Playlist_Tracks_Order_By = {
  created_at?: Maybe<Order_By>;
  playlist?: Maybe<Playlists_Order_By>;
  playlist_id?: Maybe<Order_By>;
  spotify_id?: Maybe<Order_By>;
  status?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
};

/** primary key columns input for table: "playlist_tracks" */
export type Playlist_Tracks_Pk_Columns_Input = {
  playlist_id: Scalars['Int'];
  spotify_id: Scalars['String'];
};

/** select columns of table "playlist_tracks" */
export enum Playlist_Tracks_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  PlaylistId = 'playlist_id',
  /** column name */
  SpotifyId = 'spotify_id',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "playlist_tracks" */
export type Playlist_Tracks_Set_Input = {
  created_at?: Maybe<Scalars['timestamptz']>;
  playlist_id?: Maybe<Scalars['Int']>;
  spotify_id?: Maybe<Scalars['String']>;
  status?: Maybe<Playlist_Track_Statuses_Enum>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Playlist_Tracks_Stddev_Fields = {
  __typename?: 'playlist_tracks_stddev_fields';
  playlist_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "playlist_tracks" */
export type Playlist_Tracks_Stddev_Order_By = {
  playlist_id?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Playlist_Tracks_Stddev_Pop_Fields = {
  __typename?: 'playlist_tracks_stddev_pop_fields';
  playlist_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "playlist_tracks" */
export type Playlist_Tracks_Stddev_Pop_Order_By = {
  playlist_id?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Playlist_Tracks_Stddev_Samp_Fields = {
  __typename?: 'playlist_tracks_stddev_samp_fields';
  playlist_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "playlist_tracks" */
export type Playlist_Tracks_Stddev_Samp_Order_By = {
  playlist_id?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Playlist_Tracks_Sum_Fields = {
  __typename?: 'playlist_tracks_sum_fields';
  playlist_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "playlist_tracks" */
export type Playlist_Tracks_Sum_Order_By = {
  playlist_id?: Maybe<Order_By>;
};

/** update columns of table "playlist_tracks" */
export enum Playlist_Tracks_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  PlaylistId = 'playlist_id',
  /** column name */
  SpotifyId = 'spotify_id',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type Playlist_Tracks_Var_Pop_Fields = {
  __typename?: 'playlist_tracks_var_pop_fields';
  playlist_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "playlist_tracks" */
export type Playlist_Tracks_Var_Pop_Order_By = {
  playlist_id?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Playlist_Tracks_Var_Samp_Fields = {
  __typename?: 'playlist_tracks_var_samp_fields';
  playlist_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "playlist_tracks" */
export type Playlist_Tracks_Var_Samp_Order_By = {
  playlist_id?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Playlist_Tracks_Variance_Fields = {
  __typename?: 'playlist_tracks_variance_fields';
  playlist_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "playlist_tracks" */
export type Playlist_Tracks_Variance_Order_By = {
  playlist_id?: Maybe<Order_By>;
};

/** columns and relationships of "playlists" */
export type Playlists = {
  __typename?: 'playlists';
  created_at: Scalars['timestamptz'];
  id: Scalars['Int'];
  /** An array relationship */
  playlist_tracks: Array<Playlist_Tracks>;
  /** An aggregated array relationship */
  playlist_tracks_aggregate: Playlist_Tracks_Aggregate;
  spm: Scalars['Int'];
  spotify_id: Scalars['String'];
  updated_at: Scalars['timestamptz'];
  user_id: Scalars['Int'];
};


/** columns and relationships of "playlists" */
export type PlaylistsPlaylist_TracksArgs = {
  distinct_on?: Maybe<Array<Playlist_Tracks_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Playlist_Tracks_Order_By>>;
  where?: Maybe<Playlist_Tracks_Bool_Exp>;
};


/** columns and relationships of "playlists" */
export type PlaylistsPlaylist_Tracks_AggregateArgs = {
  distinct_on?: Maybe<Array<Playlist_Tracks_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Playlist_Tracks_Order_By>>;
  where?: Maybe<Playlist_Tracks_Bool_Exp>;
};

/** aggregated selection of "playlists" */
export type Playlists_Aggregate = {
  __typename?: 'playlists_aggregate';
  aggregate?: Maybe<Playlists_Aggregate_Fields>;
  nodes: Array<Playlists>;
};

/** aggregate fields of "playlists" */
export type Playlists_Aggregate_Fields = {
  __typename?: 'playlists_aggregate_fields';
  avg?: Maybe<Playlists_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Playlists_Max_Fields>;
  min?: Maybe<Playlists_Min_Fields>;
  stddev?: Maybe<Playlists_Stddev_Fields>;
  stddev_pop?: Maybe<Playlists_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Playlists_Stddev_Samp_Fields>;
  sum?: Maybe<Playlists_Sum_Fields>;
  var_pop?: Maybe<Playlists_Var_Pop_Fields>;
  var_samp?: Maybe<Playlists_Var_Samp_Fields>;
  variance?: Maybe<Playlists_Variance_Fields>;
};


/** aggregate fields of "playlists" */
export type Playlists_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Playlists_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "playlists" */
export type Playlists_Aggregate_Order_By = {
  avg?: Maybe<Playlists_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Playlists_Max_Order_By>;
  min?: Maybe<Playlists_Min_Order_By>;
  stddev?: Maybe<Playlists_Stddev_Order_By>;
  stddev_pop?: Maybe<Playlists_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Playlists_Stddev_Samp_Order_By>;
  sum?: Maybe<Playlists_Sum_Order_By>;
  var_pop?: Maybe<Playlists_Var_Pop_Order_By>;
  var_samp?: Maybe<Playlists_Var_Samp_Order_By>;
  variance?: Maybe<Playlists_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "playlists" */
export type Playlists_Arr_Rel_Insert_Input = {
  data: Array<Playlists_Insert_Input>;
  on_conflict?: Maybe<Playlists_On_Conflict>;
};

/** aggregate avg on columns */
export type Playlists_Avg_Fields = {
  __typename?: 'playlists_avg_fields';
  id?: Maybe<Scalars['Float']>;
  spm?: Maybe<Scalars['Float']>;
  user_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "playlists" */
export type Playlists_Avg_Order_By = {
  id?: Maybe<Order_By>;
  spm?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "playlists". All fields are combined with a logical 'AND'. */
export type Playlists_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Playlists_Bool_Exp>>>;
  _not?: Maybe<Playlists_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Playlists_Bool_Exp>>>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Int_Comparison_Exp>;
  playlist_tracks?: Maybe<Playlist_Tracks_Bool_Exp>;
  spm?: Maybe<Int_Comparison_Exp>;
  spotify_id?: Maybe<String_Comparison_Exp>;
  updated_at?: Maybe<Timestamptz_Comparison_Exp>;
  user_id?: Maybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "playlists" */
export enum Playlists_Constraint {
  /** unique or primary key constraint */
  PlaylistsPkey = 'playlists_pkey',
  /** unique or primary key constraint */
  PlaylistsSpotifyIdKey = 'playlists_spotify_id_key',
  /** unique or primary key constraint */
  PlaylistsUserIdSpmKey = 'playlists_user_id_spm_key'
}

/** input type for incrementing integer column in table "playlists" */
export type Playlists_Inc_Input = {
  id?: Maybe<Scalars['Int']>;
  spm?: Maybe<Scalars['Int']>;
  user_id?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "playlists" */
export type Playlists_Insert_Input = {
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  playlist_tracks?: Maybe<Playlist_Tracks_Arr_Rel_Insert_Input>;
  spm?: Maybe<Scalars['Int']>;
  spotify_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type Playlists_Max_Fields = {
  __typename?: 'playlists_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  spm?: Maybe<Scalars['Int']>;
  spotify_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['Int']>;
};

/** order by max() on columns of table "playlists" */
export type Playlists_Max_Order_By = {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  spm?: Maybe<Order_By>;
  spotify_id?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Playlists_Min_Fields = {
  __typename?: 'playlists_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  spm?: Maybe<Scalars['Int']>;
  spotify_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['Int']>;
};

/** order by min() on columns of table "playlists" */
export type Playlists_Min_Order_By = {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  spm?: Maybe<Order_By>;
  spotify_id?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "playlists" */
export type Playlists_Mutation_Response = {
  __typename?: 'playlists_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Playlists>;
};

/** input type for inserting object relation for remote table "playlists" */
export type Playlists_Obj_Rel_Insert_Input = {
  data: Playlists_Insert_Input;
  on_conflict?: Maybe<Playlists_On_Conflict>;
};

/** on conflict condition type for table "playlists" */
export type Playlists_On_Conflict = {
  constraint: Playlists_Constraint;
  update_columns: Array<Playlists_Update_Column>;
  where?: Maybe<Playlists_Bool_Exp>;
};

/** ordering options when selecting data from "playlists" */
export type Playlists_Order_By = {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  playlist_tracks_aggregate?: Maybe<Playlist_Tracks_Aggregate_Order_By>;
  spm?: Maybe<Order_By>;
  spotify_id?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** primary key columns input for table: "playlists" */
export type Playlists_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** select columns of table "playlists" */
export enum Playlists_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Spm = 'spm',
  /** column name */
  SpotifyId = 'spotify_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "playlists" */
export type Playlists_Set_Input = {
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  spm?: Maybe<Scalars['Int']>;
  spotify_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type Playlists_Stddev_Fields = {
  __typename?: 'playlists_stddev_fields';
  id?: Maybe<Scalars['Float']>;
  spm?: Maybe<Scalars['Float']>;
  user_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "playlists" */
export type Playlists_Stddev_Order_By = {
  id?: Maybe<Order_By>;
  spm?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Playlists_Stddev_Pop_Fields = {
  __typename?: 'playlists_stddev_pop_fields';
  id?: Maybe<Scalars['Float']>;
  spm?: Maybe<Scalars['Float']>;
  user_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "playlists" */
export type Playlists_Stddev_Pop_Order_By = {
  id?: Maybe<Order_By>;
  spm?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Playlists_Stddev_Samp_Fields = {
  __typename?: 'playlists_stddev_samp_fields';
  id?: Maybe<Scalars['Float']>;
  spm?: Maybe<Scalars['Float']>;
  user_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "playlists" */
export type Playlists_Stddev_Samp_Order_By = {
  id?: Maybe<Order_By>;
  spm?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Playlists_Sum_Fields = {
  __typename?: 'playlists_sum_fields';
  id?: Maybe<Scalars['Int']>;
  spm?: Maybe<Scalars['Int']>;
  user_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "playlists" */
export type Playlists_Sum_Order_By = {
  id?: Maybe<Order_By>;
  spm?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** update columns of table "playlists" */
export enum Playlists_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Spm = 'spm',
  /** column name */
  SpotifyId = 'spotify_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
}

/** aggregate var_pop on columns */
export type Playlists_Var_Pop_Fields = {
  __typename?: 'playlists_var_pop_fields';
  id?: Maybe<Scalars['Float']>;
  spm?: Maybe<Scalars['Float']>;
  user_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "playlists" */
export type Playlists_Var_Pop_Order_By = {
  id?: Maybe<Order_By>;
  spm?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Playlists_Var_Samp_Fields = {
  __typename?: 'playlists_var_samp_fields';
  id?: Maybe<Scalars['Float']>;
  spm?: Maybe<Scalars['Float']>;
  user_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "playlists" */
export type Playlists_Var_Samp_Order_By = {
  id?: Maybe<Order_By>;
  spm?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Playlists_Variance_Fields = {
  __typename?: 'playlists_variance_fields';
  id?: Maybe<Scalars['Float']>;
  spm?: Maybe<Scalars['Float']>;
  user_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "playlists" */
export type Playlists_Variance_Order_By = {
  id?: Maybe<Order_By>;
  spm?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** query root */
export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "library_sync_statuses" */
  library_sync_statuses: Array<Library_Sync_Statuses>;
  /** fetch aggregated fields from the table: "library_sync_statuses" */
  library_sync_statuses_aggregate: Library_Sync_Statuses_Aggregate;
  /** fetch data from the table: "library_sync_statuses" using primary key columns */
  library_sync_statuses_by_pk?: Maybe<Library_Sync_Statuses>;
  /** fetch data from the table: "playlist_track_statuses" */
  playlist_track_statuses: Array<Playlist_Track_Statuses>;
  /** fetch aggregated fields from the table: "playlist_track_statuses" */
  playlist_track_statuses_aggregate: Playlist_Track_Statuses_Aggregate;
  /** fetch data from the table: "playlist_track_statuses" using primary key columns */
  playlist_track_statuses_by_pk?: Maybe<Playlist_Track_Statuses>;
  /** fetch data from the table: "playlist_tracks" */
  playlist_tracks: Array<Playlist_Tracks>;
  /** fetch aggregated fields from the table: "playlist_tracks" */
  playlist_tracks_aggregate: Playlist_Tracks_Aggregate;
  /** fetch data from the table: "playlist_tracks" using primary key columns */
  playlist_tracks_by_pk?: Maybe<Playlist_Tracks>;
  /** fetch data from the table: "playlists" */
  playlists: Array<Playlists>;
  /** fetch aggregated fields from the table: "playlists" */
  playlists_aggregate: Playlists_Aggregate;
  /** fetch data from the table: "playlists" using primary key columns */
  playlists_by_pk?: Maybe<Playlists>;
  /** fetch data from the table: "stride_event_types" */
  stride_event_types: Array<Stride_Event_Types>;
  /** fetch aggregated fields from the table: "stride_event_types" */
  stride_event_types_aggregate: Stride_Event_Types_Aggregate;
  /** fetch data from the table: "stride_event_types" using primary key columns */
  stride_event_types_by_pk?: Maybe<Stride_Event_Types>;
  /** fetch data from the table: "stride_events" */
  stride_events: Array<Stride_Events>;
  /** fetch aggregated fields from the table: "stride_events" */
  stride_events_aggregate: Stride_Events_Aggregate;
  /** fetch data from the table: "stride_events" using primary key columns */
  stride_events_by_pk?: Maybe<Stride_Events>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
};


/** query root */
export type Query_RootLibrary_Sync_StatusesArgs = {
  distinct_on?: Maybe<Array<Library_Sync_Statuses_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Library_Sync_Statuses_Order_By>>;
  where?: Maybe<Library_Sync_Statuses_Bool_Exp>;
};


/** query root */
export type Query_RootLibrary_Sync_Statuses_AggregateArgs = {
  distinct_on?: Maybe<Array<Library_Sync_Statuses_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Library_Sync_Statuses_Order_By>>;
  where?: Maybe<Library_Sync_Statuses_Bool_Exp>;
};


/** query root */
export type Query_RootLibrary_Sync_Statuses_By_PkArgs = {
  value: Scalars['String'];
};


/** query root */
export type Query_RootPlaylist_Track_StatusesArgs = {
  distinct_on?: Maybe<Array<Playlist_Track_Statuses_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Playlist_Track_Statuses_Order_By>>;
  where?: Maybe<Playlist_Track_Statuses_Bool_Exp>;
};


/** query root */
export type Query_RootPlaylist_Track_Statuses_AggregateArgs = {
  distinct_on?: Maybe<Array<Playlist_Track_Statuses_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Playlist_Track_Statuses_Order_By>>;
  where?: Maybe<Playlist_Track_Statuses_Bool_Exp>;
};


/** query root */
export type Query_RootPlaylist_Track_Statuses_By_PkArgs = {
  value: Scalars['String'];
};


/** query root */
export type Query_RootPlaylist_TracksArgs = {
  distinct_on?: Maybe<Array<Playlist_Tracks_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Playlist_Tracks_Order_By>>;
  where?: Maybe<Playlist_Tracks_Bool_Exp>;
};


/** query root */
export type Query_RootPlaylist_Tracks_AggregateArgs = {
  distinct_on?: Maybe<Array<Playlist_Tracks_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Playlist_Tracks_Order_By>>;
  where?: Maybe<Playlist_Tracks_Bool_Exp>;
};


/** query root */
export type Query_RootPlaylist_Tracks_By_PkArgs = {
  playlist_id: Scalars['Int'];
  spotify_id: Scalars['String'];
};


/** query root */
export type Query_RootPlaylistsArgs = {
  distinct_on?: Maybe<Array<Playlists_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Playlists_Order_By>>;
  where?: Maybe<Playlists_Bool_Exp>;
};


/** query root */
export type Query_RootPlaylists_AggregateArgs = {
  distinct_on?: Maybe<Array<Playlists_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Playlists_Order_By>>;
  where?: Maybe<Playlists_Bool_Exp>;
};


/** query root */
export type Query_RootPlaylists_By_PkArgs = {
  id: Scalars['Int'];
};


/** query root */
export type Query_RootStride_Event_TypesArgs = {
  distinct_on?: Maybe<Array<Stride_Event_Types_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Stride_Event_Types_Order_By>>;
  where?: Maybe<Stride_Event_Types_Bool_Exp>;
};


/** query root */
export type Query_RootStride_Event_Types_AggregateArgs = {
  distinct_on?: Maybe<Array<Stride_Event_Types_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Stride_Event_Types_Order_By>>;
  where?: Maybe<Stride_Event_Types_Bool_Exp>;
};


/** query root */
export type Query_RootStride_Event_Types_By_PkArgs = {
  value: Scalars['String'];
};


/** query root */
export type Query_RootStride_EventsArgs = {
  distinct_on?: Maybe<Array<Stride_Events_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Stride_Events_Order_By>>;
  where?: Maybe<Stride_Events_Bool_Exp>;
};


/** query root */
export type Query_RootStride_Events_AggregateArgs = {
  distinct_on?: Maybe<Array<Stride_Events_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Stride_Events_Order_By>>;
  where?: Maybe<Stride_Events_Bool_Exp>;
};


/** query root */
export type Query_RootStride_Events_By_PkArgs = {
  id: Scalars['Int'];
};


/** query root */
export type Query_RootUsersArgs = {
  distinct_on?: Maybe<Array<Users_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Users_Order_By>>;
  where?: Maybe<Users_Bool_Exp>;
};


/** query root */
export type Query_RootUsers_AggregateArgs = {
  distinct_on?: Maybe<Array<Users_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Users_Order_By>>;
  where?: Maybe<Users_Bool_Exp>;
};


/** query root */
export type Query_RootUsers_By_PkArgs = {
  id: Scalars['Int'];
};

/** columns and relationships of "stride_event_types" */
export type Stride_Event_Types = {
  __typename?: 'stride_event_types';
  comment?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

/** aggregated selection of "stride_event_types" */
export type Stride_Event_Types_Aggregate = {
  __typename?: 'stride_event_types_aggregate';
  aggregate?: Maybe<Stride_Event_Types_Aggregate_Fields>;
  nodes: Array<Stride_Event_Types>;
};

/** aggregate fields of "stride_event_types" */
export type Stride_Event_Types_Aggregate_Fields = {
  __typename?: 'stride_event_types_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Stride_Event_Types_Max_Fields>;
  min?: Maybe<Stride_Event_Types_Min_Fields>;
};


/** aggregate fields of "stride_event_types" */
export type Stride_Event_Types_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Stride_Event_Types_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "stride_event_types" */
export type Stride_Event_Types_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Stride_Event_Types_Max_Order_By>;
  min?: Maybe<Stride_Event_Types_Min_Order_By>;
};

/** input type for inserting array relation for remote table "stride_event_types" */
export type Stride_Event_Types_Arr_Rel_Insert_Input = {
  data: Array<Stride_Event_Types_Insert_Input>;
  on_conflict?: Maybe<Stride_Event_Types_On_Conflict>;
};

/** Boolean expression to filter rows from the table "stride_event_types". All fields are combined with a logical 'AND'. */
export type Stride_Event_Types_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Stride_Event_Types_Bool_Exp>>>;
  _not?: Maybe<Stride_Event_Types_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Stride_Event_Types_Bool_Exp>>>;
  comment?: Maybe<String_Comparison_Exp>;
  value?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "stride_event_types" */
export enum Stride_Event_Types_Constraint {
  /** unique or primary key constraint */
  StrideEventTypesPkey = 'stride_event_types_pkey'
}

export enum Stride_Event_Types_Enum {
  /** finish a stride */
  Finish = 'FINISH',
  /** update the spm for a stride */
  SpmUpdate = 'SPM_UPDATE',
  /** start a stride */
  Start = 'START'
}

/** expression to compare columns of type stride_event_types_enum. All fields are combined with logical 'AND'. */
export type Stride_Event_Types_Enum_Comparison_Exp = {
  _eq?: Maybe<Stride_Event_Types_Enum>;
  _in?: Maybe<Array<Stride_Event_Types_Enum>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<Stride_Event_Types_Enum>;
  _nin?: Maybe<Array<Stride_Event_Types_Enum>>;
};

/** input type for inserting data into table "stride_event_types" */
export type Stride_Event_Types_Insert_Input = {
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Stride_Event_Types_Max_Fields = {
  __typename?: 'stride_event_types_max_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "stride_event_types" */
export type Stride_Event_Types_Max_Order_By = {
  comment?: Maybe<Order_By>;
  value?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Stride_Event_Types_Min_Fields = {
  __typename?: 'stride_event_types_min_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "stride_event_types" */
export type Stride_Event_Types_Min_Order_By = {
  comment?: Maybe<Order_By>;
  value?: Maybe<Order_By>;
};

/** response of any mutation on the table "stride_event_types" */
export type Stride_Event_Types_Mutation_Response = {
  __typename?: 'stride_event_types_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Stride_Event_Types>;
};

/** input type for inserting object relation for remote table "stride_event_types" */
export type Stride_Event_Types_Obj_Rel_Insert_Input = {
  data: Stride_Event_Types_Insert_Input;
  on_conflict?: Maybe<Stride_Event_Types_On_Conflict>;
};

/** on conflict condition type for table "stride_event_types" */
export type Stride_Event_Types_On_Conflict = {
  constraint: Stride_Event_Types_Constraint;
  update_columns: Array<Stride_Event_Types_Update_Column>;
  where?: Maybe<Stride_Event_Types_Bool_Exp>;
};

/** ordering options when selecting data from "stride_event_types" */
export type Stride_Event_Types_Order_By = {
  comment?: Maybe<Order_By>;
  value?: Maybe<Order_By>;
};

/** primary key columns input for table: "stride_event_types" */
export type Stride_Event_Types_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "stride_event_types" */
export enum Stride_Event_Types_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "stride_event_types" */
export type Stride_Event_Types_Set_Input = {
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** update columns of table "stride_event_types" */
export enum Stride_Event_Types_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** columns and relationships of "stride_events" */
export type Stride_Events = {
  __typename?: 'stride_events';
  created_at: Scalars['timestamptz'];
  id: Scalars['Int'];
  payload: Scalars['jsonb'];
  type: Stride_Event_Types_Enum;
  user_id: Scalars['Int'];
};


/** columns and relationships of "stride_events" */
export type Stride_EventsPayloadArgs = {
  path?: Maybe<Scalars['String']>;
};

/** aggregated selection of "stride_events" */
export type Stride_Events_Aggregate = {
  __typename?: 'stride_events_aggregate';
  aggregate?: Maybe<Stride_Events_Aggregate_Fields>;
  nodes: Array<Stride_Events>;
};

/** aggregate fields of "stride_events" */
export type Stride_Events_Aggregate_Fields = {
  __typename?: 'stride_events_aggregate_fields';
  avg?: Maybe<Stride_Events_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Stride_Events_Max_Fields>;
  min?: Maybe<Stride_Events_Min_Fields>;
  stddev?: Maybe<Stride_Events_Stddev_Fields>;
  stddev_pop?: Maybe<Stride_Events_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Stride_Events_Stddev_Samp_Fields>;
  sum?: Maybe<Stride_Events_Sum_Fields>;
  var_pop?: Maybe<Stride_Events_Var_Pop_Fields>;
  var_samp?: Maybe<Stride_Events_Var_Samp_Fields>;
  variance?: Maybe<Stride_Events_Variance_Fields>;
};


/** aggregate fields of "stride_events" */
export type Stride_Events_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Stride_Events_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "stride_events" */
export type Stride_Events_Aggregate_Order_By = {
  avg?: Maybe<Stride_Events_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Stride_Events_Max_Order_By>;
  min?: Maybe<Stride_Events_Min_Order_By>;
  stddev?: Maybe<Stride_Events_Stddev_Order_By>;
  stddev_pop?: Maybe<Stride_Events_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Stride_Events_Stddev_Samp_Order_By>;
  sum?: Maybe<Stride_Events_Sum_Order_By>;
  var_pop?: Maybe<Stride_Events_Var_Pop_Order_By>;
  var_samp?: Maybe<Stride_Events_Var_Samp_Order_By>;
  variance?: Maybe<Stride_Events_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Stride_Events_Append_Input = {
  payload?: Maybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "stride_events" */
export type Stride_Events_Arr_Rel_Insert_Input = {
  data: Array<Stride_Events_Insert_Input>;
  on_conflict?: Maybe<Stride_Events_On_Conflict>;
};

/** aggregate avg on columns */
export type Stride_Events_Avg_Fields = {
  __typename?: 'stride_events_avg_fields';
  id?: Maybe<Scalars['Float']>;
  user_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "stride_events" */
export type Stride_Events_Avg_Order_By = {
  id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "stride_events". All fields are combined with a logical 'AND'. */
export type Stride_Events_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Stride_Events_Bool_Exp>>>;
  _not?: Maybe<Stride_Events_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Stride_Events_Bool_Exp>>>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Int_Comparison_Exp>;
  payload?: Maybe<Jsonb_Comparison_Exp>;
  type?: Maybe<Stride_Event_Types_Enum_Comparison_Exp>;
  user_id?: Maybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "stride_events" */
export enum Stride_Events_Constraint {
  /** unique or primary key constraint */
  StrideEventsPkey = 'stride_events_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Stride_Events_Delete_At_Path_Input = {
  payload?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Stride_Events_Delete_Elem_Input = {
  payload?: Maybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Stride_Events_Delete_Key_Input = {
  payload?: Maybe<Scalars['String']>;
};

/** input type for incrementing integer column in table "stride_events" */
export type Stride_Events_Inc_Input = {
  id?: Maybe<Scalars['Int']>;
  user_id?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "stride_events" */
export type Stride_Events_Insert_Input = {
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  payload?: Maybe<Scalars['jsonb']>;
  type?: Maybe<Stride_Event_Types_Enum>;
  user_id?: Maybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type Stride_Events_Max_Fields = {
  __typename?: 'stride_events_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  user_id?: Maybe<Scalars['Int']>;
};

/** order by max() on columns of table "stride_events" */
export type Stride_Events_Max_Order_By = {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Stride_Events_Min_Fields = {
  __typename?: 'stride_events_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  user_id?: Maybe<Scalars['Int']>;
};

/** order by min() on columns of table "stride_events" */
export type Stride_Events_Min_Order_By = {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "stride_events" */
export type Stride_Events_Mutation_Response = {
  __typename?: 'stride_events_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Stride_Events>;
};

/** input type for inserting object relation for remote table "stride_events" */
export type Stride_Events_Obj_Rel_Insert_Input = {
  data: Stride_Events_Insert_Input;
  on_conflict?: Maybe<Stride_Events_On_Conflict>;
};

/** on conflict condition type for table "stride_events" */
export type Stride_Events_On_Conflict = {
  constraint: Stride_Events_Constraint;
  update_columns: Array<Stride_Events_Update_Column>;
  where?: Maybe<Stride_Events_Bool_Exp>;
};

/** ordering options when selecting data from "stride_events" */
export type Stride_Events_Order_By = {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  payload?: Maybe<Order_By>;
  type?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** primary key columns input for table: "stride_events" */
export type Stride_Events_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Stride_Events_Prepend_Input = {
  payload?: Maybe<Scalars['jsonb']>;
};

/** select columns of table "stride_events" */
export enum Stride_Events_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Payload = 'payload',
  /** column name */
  Type = 'type',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "stride_events" */
export type Stride_Events_Set_Input = {
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  payload?: Maybe<Scalars['jsonb']>;
  type?: Maybe<Stride_Event_Types_Enum>;
  user_id?: Maybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type Stride_Events_Stddev_Fields = {
  __typename?: 'stride_events_stddev_fields';
  id?: Maybe<Scalars['Float']>;
  user_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "stride_events" */
export type Stride_Events_Stddev_Order_By = {
  id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Stride_Events_Stddev_Pop_Fields = {
  __typename?: 'stride_events_stddev_pop_fields';
  id?: Maybe<Scalars['Float']>;
  user_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "stride_events" */
export type Stride_Events_Stddev_Pop_Order_By = {
  id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Stride_Events_Stddev_Samp_Fields = {
  __typename?: 'stride_events_stddev_samp_fields';
  id?: Maybe<Scalars['Float']>;
  user_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "stride_events" */
export type Stride_Events_Stddev_Samp_Order_By = {
  id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Stride_Events_Sum_Fields = {
  __typename?: 'stride_events_sum_fields';
  id?: Maybe<Scalars['Int']>;
  user_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "stride_events" */
export type Stride_Events_Sum_Order_By = {
  id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** update columns of table "stride_events" */
export enum Stride_Events_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Payload = 'payload',
  /** column name */
  Type = 'type',
  /** column name */
  UserId = 'user_id'
}

/** aggregate var_pop on columns */
export type Stride_Events_Var_Pop_Fields = {
  __typename?: 'stride_events_var_pop_fields';
  id?: Maybe<Scalars['Float']>;
  user_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "stride_events" */
export type Stride_Events_Var_Pop_Order_By = {
  id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Stride_Events_Var_Samp_Fields = {
  __typename?: 'stride_events_var_samp_fields';
  id?: Maybe<Scalars['Float']>;
  user_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "stride_events" */
export type Stride_Events_Var_Samp_Order_By = {
  id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Stride_Events_Variance_Fields = {
  __typename?: 'stride_events_variance_fields';
  id?: Maybe<Scalars['Float']>;
  user_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "stride_events" */
export type Stride_Events_Variance_Order_By = {
  id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** subscription root */
export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "library_sync_statuses" */
  library_sync_statuses: Array<Library_Sync_Statuses>;
  /** fetch aggregated fields from the table: "library_sync_statuses" */
  library_sync_statuses_aggregate: Library_Sync_Statuses_Aggregate;
  /** fetch data from the table: "library_sync_statuses" using primary key columns */
  library_sync_statuses_by_pk?: Maybe<Library_Sync_Statuses>;
  /** fetch data from the table: "playlist_track_statuses" */
  playlist_track_statuses: Array<Playlist_Track_Statuses>;
  /** fetch aggregated fields from the table: "playlist_track_statuses" */
  playlist_track_statuses_aggregate: Playlist_Track_Statuses_Aggregate;
  /** fetch data from the table: "playlist_track_statuses" using primary key columns */
  playlist_track_statuses_by_pk?: Maybe<Playlist_Track_Statuses>;
  /** fetch data from the table: "playlist_tracks" */
  playlist_tracks: Array<Playlist_Tracks>;
  /** fetch aggregated fields from the table: "playlist_tracks" */
  playlist_tracks_aggregate: Playlist_Tracks_Aggregate;
  /** fetch data from the table: "playlist_tracks" using primary key columns */
  playlist_tracks_by_pk?: Maybe<Playlist_Tracks>;
  /** fetch data from the table: "playlists" */
  playlists: Array<Playlists>;
  /** fetch aggregated fields from the table: "playlists" */
  playlists_aggregate: Playlists_Aggregate;
  /** fetch data from the table: "playlists" using primary key columns */
  playlists_by_pk?: Maybe<Playlists>;
  /** fetch data from the table: "stride_event_types" */
  stride_event_types: Array<Stride_Event_Types>;
  /** fetch aggregated fields from the table: "stride_event_types" */
  stride_event_types_aggregate: Stride_Event_Types_Aggregate;
  /** fetch data from the table: "stride_event_types" using primary key columns */
  stride_event_types_by_pk?: Maybe<Stride_Event_Types>;
  /** fetch data from the table: "stride_events" */
  stride_events: Array<Stride_Events>;
  /** fetch aggregated fields from the table: "stride_events" */
  stride_events_aggregate: Stride_Events_Aggregate;
  /** fetch data from the table: "stride_events" using primary key columns */
  stride_events_by_pk?: Maybe<Stride_Events>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
};


/** subscription root */
export type Subscription_RootLibrary_Sync_StatusesArgs = {
  distinct_on?: Maybe<Array<Library_Sync_Statuses_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Library_Sync_Statuses_Order_By>>;
  where?: Maybe<Library_Sync_Statuses_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootLibrary_Sync_Statuses_AggregateArgs = {
  distinct_on?: Maybe<Array<Library_Sync_Statuses_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Library_Sync_Statuses_Order_By>>;
  where?: Maybe<Library_Sync_Statuses_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootLibrary_Sync_Statuses_By_PkArgs = {
  value: Scalars['String'];
};


/** subscription root */
export type Subscription_RootPlaylist_Track_StatusesArgs = {
  distinct_on?: Maybe<Array<Playlist_Track_Statuses_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Playlist_Track_Statuses_Order_By>>;
  where?: Maybe<Playlist_Track_Statuses_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootPlaylist_Track_Statuses_AggregateArgs = {
  distinct_on?: Maybe<Array<Playlist_Track_Statuses_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Playlist_Track_Statuses_Order_By>>;
  where?: Maybe<Playlist_Track_Statuses_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootPlaylist_Track_Statuses_By_PkArgs = {
  value: Scalars['String'];
};


/** subscription root */
export type Subscription_RootPlaylist_TracksArgs = {
  distinct_on?: Maybe<Array<Playlist_Tracks_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Playlist_Tracks_Order_By>>;
  where?: Maybe<Playlist_Tracks_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootPlaylist_Tracks_AggregateArgs = {
  distinct_on?: Maybe<Array<Playlist_Tracks_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Playlist_Tracks_Order_By>>;
  where?: Maybe<Playlist_Tracks_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootPlaylist_Tracks_By_PkArgs = {
  playlist_id: Scalars['Int'];
  spotify_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootPlaylistsArgs = {
  distinct_on?: Maybe<Array<Playlists_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Playlists_Order_By>>;
  where?: Maybe<Playlists_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootPlaylists_AggregateArgs = {
  distinct_on?: Maybe<Array<Playlists_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Playlists_Order_By>>;
  where?: Maybe<Playlists_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootPlaylists_By_PkArgs = {
  id: Scalars['Int'];
};


/** subscription root */
export type Subscription_RootStride_Event_TypesArgs = {
  distinct_on?: Maybe<Array<Stride_Event_Types_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Stride_Event_Types_Order_By>>;
  where?: Maybe<Stride_Event_Types_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootStride_Event_Types_AggregateArgs = {
  distinct_on?: Maybe<Array<Stride_Event_Types_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Stride_Event_Types_Order_By>>;
  where?: Maybe<Stride_Event_Types_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootStride_Event_Types_By_PkArgs = {
  value: Scalars['String'];
};


/** subscription root */
export type Subscription_RootStride_EventsArgs = {
  distinct_on?: Maybe<Array<Stride_Events_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Stride_Events_Order_By>>;
  where?: Maybe<Stride_Events_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootStride_Events_AggregateArgs = {
  distinct_on?: Maybe<Array<Stride_Events_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Stride_Events_Order_By>>;
  where?: Maybe<Stride_Events_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootStride_Events_By_PkArgs = {
  id: Scalars['Int'];
};


/** subscription root */
export type Subscription_RootUsersArgs = {
  distinct_on?: Maybe<Array<Users_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Users_Order_By>>;
  where?: Maybe<Users_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUsers_AggregateArgs = {
  distinct_on?: Maybe<Array<Users_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Users_Order_By>>;
  where?: Maybe<Users_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUsers_By_PkArgs = {
  id: Scalars['Int'];
};


/** expression to compare columns of type timestamptz. All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: Maybe<Scalars['timestamptz']>;
  _gt?: Maybe<Scalars['timestamptz']>;
  _gte?: Maybe<Scalars['timestamptz']>;
  _in?: Maybe<Array<Scalars['timestamptz']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['timestamptz']>;
  _lte?: Maybe<Scalars['timestamptz']>;
  _neq?: Maybe<Scalars['timestamptz']>;
  _nin?: Maybe<Array<Scalars['timestamptz']>>;
};

/** columns and relationships of "users" */
export type Users = {
  __typename?: 'users';
  created_at: Scalars['timestamptz'];
  id: Scalars['Int'];
  library_sync_status: Library_Sync_Statuses_Enum;
  /** An array relationship */
  playlists: Array<Playlists>;
  /** An aggregated array relationship */
  playlists_aggregate: Playlists_Aggregate;
  spotify_refresh_token?: Maybe<Scalars['String']>;
  spotify_user_id: Scalars['String'];
  updated_at: Scalars['timestamptz'];
};


/** columns and relationships of "users" */
export type UsersPlaylistsArgs = {
  distinct_on?: Maybe<Array<Playlists_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Playlists_Order_By>>;
  where?: Maybe<Playlists_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersPlaylists_AggregateArgs = {
  distinct_on?: Maybe<Array<Playlists_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Playlists_Order_By>>;
  where?: Maybe<Playlists_Bool_Exp>;
};

/** aggregated selection of "users" */
export type Users_Aggregate = {
  __typename?: 'users_aggregate';
  aggregate?: Maybe<Users_Aggregate_Fields>;
  nodes: Array<Users>;
};

/** aggregate fields of "users" */
export type Users_Aggregate_Fields = {
  __typename?: 'users_aggregate_fields';
  avg?: Maybe<Users_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Users_Max_Fields>;
  min?: Maybe<Users_Min_Fields>;
  stddev?: Maybe<Users_Stddev_Fields>;
  stddev_pop?: Maybe<Users_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Users_Stddev_Samp_Fields>;
  sum?: Maybe<Users_Sum_Fields>;
  var_pop?: Maybe<Users_Var_Pop_Fields>;
  var_samp?: Maybe<Users_Var_Samp_Fields>;
  variance?: Maybe<Users_Variance_Fields>;
};


/** aggregate fields of "users" */
export type Users_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Users_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "users" */
export type Users_Aggregate_Order_By = {
  avg?: Maybe<Users_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Users_Max_Order_By>;
  min?: Maybe<Users_Min_Order_By>;
  stddev?: Maybe<Users_Stddev_Order_By>;
  stddev_pop?: Maybe<Users_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Users_Stddev_Samp_Order_By>;
  sum?: Maybe<Users_Sum_Order_By>;
  var_pop?: Maybe<Users_Var_Pop_Order_By>;
  var_samp?: Maybe<Users_Var_Samp_Order_By>;
  variance?: Maybe<Users_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "users" */
export type Users_Arr_Rel_Insert_Input = {
  data: Array<Users_Insert_Input>;
  on_conflict?: Maybe<Users_On_Conflict>;
};

/** aggregate avg on columns */
export type Users_Avg_Fields = {
  __typename?: 'users_avg_fields';
  id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "users" */
export type Users_Avg_Order_By = {
  id?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Users_Bool_Exp>>>;
  _not?: Maybe<Users_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Users_Bool_Exp>>>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Int_Comparison_Exp>;
  library_sync_status?: Maybe<Library_Sync_Statuses_Enum_Comparison_Exp>;
  playlists?: Maybe<Playlists_Bool_Exp>;
  spotify_refresh_token?: Maybe<String_Comparison_Exp>;
  spotify_user_id?: Maybe<String_Comparison_Exp>;
  updated_at?: Maybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "users" */
export enum Users_Constraint {
  /** unique or primary key constraint */
  UsersPkey = 'users_pkey',
  /** unique or primary key constraint */
  UsersSpotifyRefreshTokenKey = 'users_spotify_refresh_token_key',
  /** unique or primary key constraint */
  UsersSpotifyUserIdKey = 'users_spotify_user_id_key'
}

/** input type for incrementing integer column in table "users" */
export type Users_Inc_Input = {
  id?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "users" */
export type Users_Insert_Input = {
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  library_sync_status?: Maybe<Library_Sync_Statuses_Enum>;
  playlists?: Maybe<Playlists_Arr_Rel_Insert_Input>;
  spotify_refresh_token?: Maybe<Scalars['String']>;
  spotify_user_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
  __typename?: 'users_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  spotify_refresh_token?: Maybe<Scalars['String']>;
  spotify_user_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "users" */
export type Users_Max_Order_By = {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  spotify_refresh_token?: Maybe<Order_By>;
  spotify_user_id?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
  __typename?: 'users_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  spotify_refresh_token?: Maybe<Scalars['String']>;
  spotify_user_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "users" */
export type Users_Min_Order_By = {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  spotify_refresh_token?: Maybe<Order_By>;
  spotify_user_id?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
};

/** response of any mutation on the table "users" */
export type Users_Mutation_Response = {
  __typename?: 'users_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Users>;
};

/** input type for inserting object relation for remote table "users" */
export type Users_Obj_Rel_Insert_Input = {
  data: Users_Insert_Input;
  on_conflict?: Maybe<Users_On_Conflict>;
};

/** on conflict condition type for table "users" */
export type Users_On_Conflict = {
  constraint: Users_Constraint;
  update_columns: Array<Users_Update_Column>;
  where?: Maybe<Users_Bool_Exp>;
};

/** ordering options when selecting data from "users" */
export type Users_Order_By = {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  library_sync_status?: Maybe<Order_By>;
  playlists_aggregate?: Maybe<Playlists_Aggregate_Order_By>;
  spotify_refresh_token?: Maybe<Order_By>;
  spotify_user_id?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
};

/** primary key columns input for table: "users" */
export type Users_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** select columns of table "users" */
export enum Users_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  LibrarySyncStatus = 'library_sync_status',
  /** column name */
  SpotifyRefreshToken = 'spotify_refresh_token',
  /** column name */
  SpotifyUserId = 'spotify_user_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "users" */
export type Users_Set_Input = {
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['Int']>;
  library_sync_status?: Maybe<Library_Sync_Statuses_Enum>;
  spotify_refresh_token?: Maybe<Scalars['String']>;
  spotify_user_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Users_Stddev_Fields = {
  __typename?: 'users_stddev_fields';
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "users" */
export type Users_Stddev_Order_By = {
  id?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Users_Stddev_Pop_Fields = {
  __typename?: 'users_stddev_pop_fields';
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "users" */
export type Users_Stddev_Pop_Order_By = {
  id?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Users_Stddev_Samp_Fields = {
  __typename?: 'users_stddev_samp_fields';
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "users" */
export type Users_Stddev_Samp_Order_By = {
  id?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Users_Sum_Fields = {
  __typename?: 'users_sum_fields';
  id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "users" */
export type Users_Sum_Order_By = {
  id?: Maybe<Order_By>;
};

/** update columns of table "users" */
export enum Users_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  LibrarySyncStatus = 'library_sync_status',
  /** column name */
  SpotifyRefreshToken = 'spotify_refresh_token',
  /** column name */
  SpotifyUserId = 'spotify_user_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type Users_Var_Pop_Fields = {
  __typename?: 'users_var_pop_fields';
  id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "users" */
export type Users_Var_Pop_Order_By = {
  id?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Users_Var_Samp_Fields = {
  __typename?: 'users_var_samp_fields';
  id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "users" */
export type Users_Var_Samp_Order_By = {
  id?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Users_Variance_Fields = {
  __typename?: 'users_variance_fields';
  id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "users" */
export type Users_Variance_Order_By = {
  id?: Maybe<Order_By>;
};


export type Query = {
  __typename?: 'Query';
  isLoggedIn: Scalars['Boolean'];
};

export type IsUserLoggedInQueryVariables = Exact<{ [key: string]: never; }>;


export type IsUserLoggedInQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'isLoggedIn'>
);

export type LoginMutationVariables = Exact<{
  spotify_authorization_code: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'mutation_root' }
  & { DemoLogIn?: Maybe<(
    { __typename?: 'DemoLogInOutput' }
    & Pick<DemoLogInOutput, 'access_token'>
  )> }
);

export type MeSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type MeSubscription = (
  { __typename?: 'subscription_root' }
  & { users: Array<(
    { __typename?: 'users' }
    & Pick<Users, 'library_sync_status'>
    & { playlists: Array<(
      { __typename?: 'playlists' }
      & Pick<Playlists, 'spm'>
    )> }
  )> }
);

export type InsertStrideEventMutationVariables = Exact<{
  payload: Scalars['jsonb'];
  type: Stride_Event_Types_Enum;
}>;


export type InsertStrideEventMutation = (
  { __typename?: 'mutation_root' }
  & { insert_stride_events?: Maybe<(
    { __typename?: 'stride_events_mutation_response' }
    & Pick<Stride_Events_Mutation_Response, 'affected_rows'>
  )> }
);


export const IsUserLoggedInDocument = gql`
    query IsUserLoggedIn {
  isLoggedIn @client
}
    `;

/**
 * __useIsUserLoggedInQuery__
 *
 * To run a query within a React component, call `useIsUserLoggedInQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsUserLoggedInQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsUserLoggedInQuery({
 *   variables: {
 *   },
 * });
 */
export function useIsUserLoggedInQuery(baseOptions?: Apollo.QueryHookOptions<IsUserLoggedInQuery, IsUserLoggedInQueryVariables>) {
        return Apollo.useQuery<IsUserLoggedInQuery, IsUserLoggedInQueryVariables>(IsUserLoggedInDocument, baseOptions);
      }
export function useIsUserLoggedInLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsUserLoggedInQuery, IsUserLoggedInQueryVariables>) {
          return Apollo.useLazyQuery<IsUserLoggedInQuery, IsUserLoggedInQueryVariables>(IsUserLoggedInDocument, baseOptions);
        }
export type IsUserLoggedInQueryHookResult = ReturnType<typeof useIsUserLoggedInQuery>;
export type IsUserLoggedInLazyQueryHookResult = ReturnType<typeof useIsUserLoggedInLazyQuery>;
export type IsUserLoggedInQueryResult = Apollo.QueryResult<IsUserLoggedInQuery, IsUserLoggedInQueryVariables>;
export const LoginDocument = gql`
    mutation Login($spotify_authorization_code: String!) {
  DemoLogIn(args: {spotify_authorization_code: $spotify_authorization_code}) {
    access_token
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      spotify_authorization_code: // value for 'spotify_authorization_code'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const MeDocument = gql`
    subscription Me {
  users {
    library_sync_status
    playlists(order_by: {spm: asc}) {
      spm
    }
  }
}
    `;

/**
 * __useMeSubscription__
 *
 * To run a query within a React component, call `useMeSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMeSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeSubscription({
 *   variables: {
 *   },
 * });
 */
export function useMeSubscription(baseOptions?: Apollo.SubscriptionHookOptions<MeSubscription, MeSubscriptionVariables>) {
        return Apollo.useSubscription<MeSubscription, MeSubscriptionVariables>(MeDocument, baseOptions);
      }
export type MeSubscriptionHookResult = ReturnType<typeof useMeSubscription>;
export type MeSubscriptionResult = Apollo.SubscriptionResult<MeSubscription>;
export const InsertStrideEventDocument = gql`
    mutation InsertStrideEvent($payload: jsonb!, $type: stride_event_types_enum!) {
  insert_stride_events(objects: {payload: $payload, type: $type}) {
    affected_rows
  }
}
    `;
export type InsertStrideEventMutationFn = Apollo.MutationFunction<InsertStrideEventMutation, InsertStrideEventMutationVariables>;

/**
 * __useInsertStrideEventMutation__
 *
 * To run a mutation, you first call `useInsertStrideEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertStrideEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertStrideEventMutation, { data, loading, error }] = useInsertStrideEventMutation({
 *   variables: {
 *      payload: // value for 'payload'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useInsertStrideEventMutation(baseOptions?: Apollo.MutationHookOptions<InsertStrideEventMutation, InsertStrideEventMutationVariables>) {
        return Apollo.useMutation<InsertStrideEventMutation, InsertStrideEventMutationVariables>(InsertStrideEventDocument, baseOptions);
      }
export type InsertStrideEventMutationHookResult = ReturnType<typeof useInsertStrideEventMutation>;
export type InsertStrideEventMutationResult = Apollo.MutationResult<InsertStrideEventMutation>;
export type InsertStrideEventMutationOptions = Apollo.BaseMutationOptions<InsertStrideEventMutation, InsertStrideEventMutationVariables>;