import React from 'react';

function Ourstory() {
  return (
<section
  id="our"
  className="bg-no-repeat bg-center bg-cover"
  style={{
    backgroundImage: "url('https://www.pngkey.com/png/detail/19-199614_sky-blue-wave-png.png')"
  }}
>
      <div className='container-fluid1 flex flex-col items-center justify-center py-20'>
        <h1 className='storytext text-3xl mb-8 font-medium'>OUR STORY</h1>
        <p className='card max-w-2xl w-full bg-white shadow-lg rounded-lg mb-16 px-6 py-4 text-left'>
          <span className="text-blue-500">KG Genius Labs Gig </span>
          was born out of the desire to bridge the gap between academic learning and professional application. We observed the challenges students face in finding relevant work experience and sought to create a solution that addresses this need. Today, we proudly connect thousands of students with meaningful freelance gigs that not only enhance their resumes but also build their confidence and competence.
        </p>
      </div>
    </section>
  )
}

export default Ourstory;
