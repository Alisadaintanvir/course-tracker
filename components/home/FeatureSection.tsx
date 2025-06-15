import { ScanIcon, BookmarkIcon, NotebookIcon } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <ScanIcon className="w-8 h-8" />,
      title: "Smart Course Scanning",
      description:
        "Automatically detect and organize courses from your local files with our intelligent scanner.",
    },
    {
      icon: <BookmarkIcon className="w-8 h-8" />,
      title: "Progress Tracking",
      description:
        "Mark lessons as completed and visualize your learning journey with interactive progress charts.",
    },
    {
      icon: <NotebookIcon className="w-8 h-8" />,
      title: "Integrated Notes",
      description:
        "Take notes directly within each lesson and easily search through them later.",
    },
  ];

  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Supercharge Your Learning
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to stay organized and motivated in your learning
            journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
