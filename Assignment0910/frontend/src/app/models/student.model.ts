export interface Student {
  id?: string;
  prn: string;
  name: string;
  course: string;
  email: string;
}

export type DBType = 'mongodb' | 'cassandra';
