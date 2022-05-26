export default interface ClassroomComplaint {
  fk_user: number;
  fk_classroom: string;
  fk_classroom_problem: number;
  created_at: Date;
  updated_at: Date;
}
