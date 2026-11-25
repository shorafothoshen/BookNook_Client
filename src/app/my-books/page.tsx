import MyBooksPage from '@/components/manuPage/MyBooks';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: "My Books" };

function MyBooks() {
  return (
    <MyBooksPage/>
  );
}

export default MyBooks;