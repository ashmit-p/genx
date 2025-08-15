// import AIAdvert from "@/components/AIAdvert";
import { DockDemo } from "@/components/Dock";
import Hero from "@/components/Hero";
import Offer from "@/components/Offer";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="container mx-auto">
        <DockDemo />
      </div>
      {/* <div className="flex flex-col -space-y-1"> */}
        <Hero />
        <Offer />
      {/* </div> */}
      {/* <AIAdvert /> */}
    </div>
  );
}