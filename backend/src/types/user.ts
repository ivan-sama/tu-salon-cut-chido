export default interface User {
  id: number;
  email: string;
  hashed_password: string;
  is_admin: boolean;
  email_validated_at: Date | null;
  created_at: Date;
  updated_at: Date;
}
