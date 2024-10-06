import React from 'react';

const Page = () => {
  return (
    <div className="min-h-screen bg-slate-200 text-slate-900 py-10 px-6">
      <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
      
      <div className="max-w-4xl mx-auto">
        <p className="text-lg mb-8">
          Welcome to our project! We are a dedicated team of developers, data enthusiasts, and designers, working together to create innovative and efficient solutions. Here is a bit more about who we are and our contributions to this website:
        </p>
        
        <div className="bg-gray-300 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold mb-2">Abhishek Sharma</h2>
          <p className="text-lg">
            <strong>Role:</strong> ML Developer<br/>
            Abhishek was responsible for integrating core machine learning functionalities into the project. He worked extensively on developing our chatbot and implementing data analytics features that allow us to extract meaningful insights from user interactions.
          </p>
        </div>

        <div className="bg-gray-300 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold mb-2">Ansh Shah</h2>
          <p className="text-lg">
            <strong>Role:</strong> FullStack Web Developer<br/>
            Ansh spearheaded the frontend development and API integrations. His work ensured seamless user experience, responsive design, and smooth handling of all frontend-backend interactions.
          </p>
        </div>

        <div className="bg-gray-300 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold mb-2">Ashish Maurya</h2>
          <p className="text-lg">
            <strong>Role:</strong> FullStack Web Developer<br/>
            Ashish played a pivotal role in integrating the entire backend of the application, setting up the server, and managing all API functionalities that power the dynamic aspects of the site.
          </p>
        </div>

        <div className="bg-gray-300 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold mb-2">Delanie Rodrigues</h2>
          <p className="text-lg">
            <strong>Role:</strong> Team Manager & UI/UX Developer<br/>
            Delanie was the driving force behind the projects design, ensuring a sleek, user-friendly interface. She also managed the team, coordinated the workflow, and led our presentations, bringing it all together.
          </p>
        </div>

        <div className="mt-10 text-center">
          <p className="text-lg">
            Our team worked tirelessly to bring this project to life, and we hope it brings value to you! Thank you for exploring our work.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
