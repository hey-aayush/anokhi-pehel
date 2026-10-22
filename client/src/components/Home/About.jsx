const AboutUs = () => (
  <section className="py-2 bg-gray-100 min-h-screen border-2 border-teal-200 relative ${styles.flexStart} overflow-hidden rounded-lg mb-20" style={{
    borderRadius: "40px", // Smooth curves
  }}>
    <div className="max-w-6xl mx-auto  shadow-lg text-center rounded-lg p-4 mb-10 overflow-hidden rounded-lg mb-16" style={{
    borderRadius: "40px", // Smooth curves
  }}>
    <h1 className="font-poppins font-bold text-4xl sm:text-5xl text-gray-900 mb-6">
        About Anokhi Pehel
      </h1>
      <p className="font-poppins text-lg sm:text-xl text-gray-900 leading-7">
        Anokhi पहल is an initiative started by a group of students from MNNIT, 
        aimed at helping underprivileged children access education. 
        What began with just a few teachers and 20 students has now grown into a team 
        of around 100 teachers, shaping the lives of over 400 students.
      </p>
    </div>

    {/* What We Do Section */}
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8 mb-10 overflow-hidden rounded-lg mb-14" style={{
    borderRadius: "40px", // Smooth curves
  }}>
      <h2 className="font-poppins font-semibold text-3xl sm:text-4xl text-gray-900 mb-2">
        What We Do
      </h2>
      <p className="font-poppins text-lg sm:text-xl text-gray-900 leading-7">
        At Anokhi पहल, we focus on more than just academics. Our teachers and volunteers 
        go beyond textbooks, teaching human and moral values. Alongside traditional subjects, 
        we offer computer and reasoning classes, equipping students with essential skills 
        for a brighter future.
      </p>
    </div>

    {/* Evening Classes Section */}
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8 mb-10 overflow-hidden rounded-lg mb-10" style={{
    borderRadius: "40px", // Smooth curves
  }}>
      <h2 className="font-poppins font-semibold text-3xl sm:text-4xl text-gray-900 mb-2">
        Evening Classes
      </h2>
      <p className="font-poppins text-lg sm:text-xl text-gray-900 leading-7">
        Student volunteers from MNNIT visit various locations daily and personally escort 
        students to classes. These volunteers dedicate two hours to teaching, covering 
        much more than what&apos;s found in textbooks. Our focus extends beyond academics, 
        instilling moral and human values in our students.
      </p>
    </div>
  </section>
);

export default AboutUs;
