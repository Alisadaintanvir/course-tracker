import { Scan, BookOpen, CheckCircle, TrendingUp } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Scan,
      title: "Import Your Courses",
      description:
        "Scan local directories or manually add your courses with all modules and lessons.",
      step: "01",
    },
    {
      icon: BookOpen,
      title: "Start Learning",
      description:
        "Access your organized course content and begin your learning journey.",
      step: "02",
    },
    {
      icon: CheckCircle,
      title: "Track Progress",
      description:
        "Mark completed lessons and modules while taking detailed notes.",
      step: "03",
    },
    {
      icon: TrendingUp,
      title: "Analyze & Improve",
      description:
        "Review your progress analytics and optimize your learning strategy.",
      step: "04",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How It{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Get started in minutes and transform your learning experience with
            our intuitive workflow.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative text-center group animate-fade-in"
              style={{
                animationDelay: `${index * 200}ms`,
                animationFillMode: "both",
              }}
            >
              {/* Step number */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md z-20">
                {step.step}
              </div>

              {/* Connecting line (desktop only, except last) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-0 right-[-50%] w-[100%] h-0.5 bg-gradient-to-r from-purple-300 to-blue-300 z-0"></div>
              )}

              {/* Step Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mt-10 relative z-10 h-full flex flex-col justify-start">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
