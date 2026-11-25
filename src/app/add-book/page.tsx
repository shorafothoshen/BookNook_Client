import AddBookPage from '@/components/manuPage/AddBookPage';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: "Add Book" };

function AddBook() {
  return (
    <AddBookPage/>
  );
}

export default AddBook;