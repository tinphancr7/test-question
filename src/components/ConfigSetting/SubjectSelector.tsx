import { useRef, useState } from "react";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";

const SubjectSelector = () => {
  // Define an array of categories (tags)
  const categories = [
    "English",
    "Math",
    "History",
    "Art",
    "Science",
    "Geography",
    "Music",
    "Physics",
    "Chemistry",
    "Biology",
    "Literature",
    "Economics",
  ];

  // State to keep track of the currently active category
  const [activeCategory, setActiveCategory] = useState("English");
  // Ref for the scrollable container to enable programmatic scrolling
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Function to handle clicking on a category button
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };

  // Function to scroll the container left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  // Function to scroll the container right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full  border-b  flex items-center overflow-hidden">
      {/* Scrollable container for category buttons */}
      <div
        ref={scrollContainerRef}
        className="flex-1 flex overflow-x-auto whitespace-nowrap scrollbar-hide px-4 py-3 "
        style={{ scrollBehavior: "smooth" }} // Ensures smooth scrolling for mouse wheel/trackpad
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            // Apply dynamic Tailwind classes based on active state
            className={`
            p-2.5 h-[42px] mx-1 text-sm rounded-lg transition-all duration-300 ease-in-out
            ${
              activeCategory === category
                ? "bg-amber-500 text-white shadow-md" // Active state styles
                : "bg-gray-200 text-gray-700 hover:bg-gray-300" // Inactive state styles
            }
            flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-300
          `}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Container for both scroll arrow buttons on the right */}
      <div className="flex  h-full ">
        <button
          onClick={scrollLeft}
          className="p-2 rounded-full hover:bg-gray-200 focus:outline-none  transition duration-200"
          aria-label="Scroll left"
        >
          <MdArrowLeft />
        </button>

        <button
          onClick={scrollRight}
          className="p-2 rounded-full hover:bg-gray-200 focus:outline-none  transition duration-200"
          aria-label="Scroll right"
        >
          <MdArrowRight />
        </button>
      </div>
    </div>
  );
};
export default SubjectSelector;
