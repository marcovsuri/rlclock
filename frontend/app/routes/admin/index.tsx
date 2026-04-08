import { redirect } from 'react-router';

export async function loader() {
  throw redirect('/admin/dashboard');
}

export default function AdminIndex() {
  return null;
}
