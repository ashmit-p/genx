// 'use client';

// import React from 'react';
// import { heroItems } from '@/lib/constants';
// import { ArrowRight } from 'lucide-react';
// import Link from 'next/link';

// const Hero = () => {
//   return (
//     <section className="relative w-full overflow-x-hidden">
//       <div className="flex-1 w-full flex flex-col items-center justify-center md:gap-20 gap-10 px-4 py-20 bg-gradient-to-b from-[#1e2e28] to-[#2f4f4f] text-white z-10 relative">
//         <div className="text-center space-y-4 pt-16 max-sm:pt-10">
//           <h1 className="text-4xl md:text-5xl font-bold montserrat-one">
//             You{' '}
//               <span className="bg-gradient-to-r from-sky-500 to-purple-500 bg-clip-text text-transparent">
//                   deserve
//               </span>{' '}
//             to be happy
//           </h1>
//           <p className="text-xl md:text-2xl text-gray-300 montserrat-one">
//             What are you looking for?
//           </p>
//         </div>

//         <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6"
//         >
//           {heroItems.map((item, i) => (
//             <Link
//               key={i}
//               href={`/blogs/${item.slug}`}
//               className="relative group overflow-hidden rounded-2xl shadow-xl transform hover:scale-[1.015] transition-all duration-300"
//             >
//               <div className="w-full h-28 md:h-80">
//                 <img
//                   src={item.img}
//                   alt={item.heading}
//                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                   loading="lazy"
//                 />
//               </div>

//               <div className="absolute inset-0 bg-black/40 text-white p-4 md:p-6 flex flex-col justify-between">
//                 <div>
//                   <h3 className="text-xl md:text-2xl font-semibold mb-1 md:mb-2">
//                     {item.heading}
//                   </h3>
//                   <p className="text-xs md:text-sm opacity-90">{item.subHeading}</p>
//                 </div>
//                 <div className="flex items-center justify-end mt-2 md:mt-4">
//                   <ArrowRight
//                     size={22}
//                     className="group-hover:translate-x-1 transition-transform duration-200"
//                   />
//                 </div>
//               </div>

//               <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-white/30 transition-all duration-300 pointer-events-none" />
//             </Link>
//           ))}
//         </div>
//       </div>
//       {/* <div className="absolute -bottom-10 -left-10 w-screen z-20">
//         <svg
//           className="w-screen h-[100px] "
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 1200 120"
//           preserveAspectRatio="none"
//         >
//           <path
//             d="M985.66,17.85c-75.59,18.37-148.76,35.19-227.15,38.19
//             -69.69,2.6-136.89-8.19-206.14-17.6
//             C465.07,25.86,392.33,6.58,320,0
//             c-87.23-8.32-174.84,5.22-261.14,17.85V120H1200V0
//             C1133.4,8.56,1060.71,1.48,985.66,17.85Z"
//             fill="#ffffff"
//             className='bg-[#92d7a7]'
//           ></path>
//         </svg>
//       </div> */}
//     </section>
//   );
// };

// export default Hero;
'use client';

import React from 'react';
import { heroItems } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { BackgroundBeamsWithCollision } from './ui/backgroundbeams';
import { motion } from 'motion/react';

const Hero = () => {
  return (
     <section className="relative w-full h-fit">
      <BackgroundBeamsWithCollision className="absolute inset-0">
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 py-12 pt-24">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold montserrat-one text-slate-900 dark:text-white">
              You{' '}
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
                deserve
              </span>{' '}
              to be happy
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 montserrat-one">
              What are you looking for?
            </p>
          </div>

            <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            {heroItems.map((item, i) => (
              <Link
                key={i}
                href={`/blogs/${item.slug}`}
                className="relative group overflow-hidden rounded-2xl shadow-xl transform hover:scale-[1.02] transition-all duration-300 h-[280px] md:h-[320px]"
              >
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className='w-full h-full'
              >
                <div className="w-full h-full">
                  <img
                    src={item.img}
                    alt={item.heading}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="absolute inset-0 bg-black/40 text-white p-4 md:p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold mb-1 md:mb-2">
                      {item.heading}
                    </h3>
                    <p className="text-sm opacity-90">{item.subHeading}</p>
                  </div>
                  <div className="flex items-center justify-end mt-2 md:mt-4">
                    <ArrowRight
                      size={22}
                      className="group-hover:translate-x-1 transition-transform duration-200"
                    />
                  </div>
                </div>

                <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-purple-500/30 transition-all duration-300 pointer-events-none" />
              </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    </section>
  );
};

export default Hero;