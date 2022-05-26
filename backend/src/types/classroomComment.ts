export default interface ClassroomComment {
  fk_user: number;
  fk_classroom: string;
  comment: string;
  created_at: Date;
  updated_at: Date;
}
