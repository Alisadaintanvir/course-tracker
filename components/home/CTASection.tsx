import { RocketIcon, ScanIcon } from "lucide-react";
import { Button } from "../ui/button";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900">
      <div className="container px-4 mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold  text-white mb-6">
          Ready to Transform Your Learning?
        </h2>
        <p className="text-xl text-gray-400  mb-10 max-w-2xl mx-auto">
          Join thousands of learners who are already organizing their courses
          and accelerating their progress.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="gap-2 bg-white text-indigo-600 hover:bg-gray-100 h-12 px-6 text-lg">
            <RocketIcon className="w-5 h-5" />
            Start for Free
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-white  hover:bg-white/10 h-12 px-6 text-lg text-indigo-600 dark:text-white"
          >
            <ScanIcon className="w-5 h-5" />
            See Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
