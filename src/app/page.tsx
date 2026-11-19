import BookCards from "@/components/BookCards";
import HeroBanner from "@/components/layout/HeroBannar";
import PromoSection from "@/components/PromoSection";
import TrendingBooks from "@/components/TrendingBooks";

export default function Home() {
  return (
   <div>
    <HeroBanner/>
    <TrendingBooks/>
    <BookCards/>
    <PromoSection/>
   </div>
  );
}
