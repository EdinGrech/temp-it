export interface Group {
  group: {
    name: string;
    description: string;
    owner: string;
    creation_date: string;
  };
  admins: GroupUser[];
  members: GroupUser[];
  sensors: GroupSensor[];
}

export interface GroupUser {
  username: string;
  email: string;
}

export interface GroupSensor {
  id: number;
  name: string;
  description: string;
}

export interface GroupBase {
  name: string;
  description: string;
}

export interface GroupBaseIdentifier extends GroupBase {
  id: number;
}

export interface GroupCreateResponse {
  name: string;
  description: string;
  owner: string;
  creation_date: string;
}

export interface GroupsSummery {
  member_groups: GroupBaseIdentifier[];
  admin_groups: GroupBaseIdentifier[];
}

export interface BackendResponse {
  detail?: string;
  error?: string;
  success?: string;
}
