import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { useState } from "react";
import QuestionSelector from "../ConfigSetting/QuestionSelector";
import QuestionSettings from "../ConfigSetting/QuestionSettings";
import TestAdvancedSettings from "../ConfigSetting/TestAdvancedSettings";

interface ModalGetMoreQuestionProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ModalGetMoreQuestion = ({
  isOpen,
  onOpenChange,
}: ModalGetMoreQuestionProps) => {
  const [maxNumQuestions, setMaxNumQuestions] = useState(100);
  const [selectedDifficulty, setSelectedDifficulty] = useState(1);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        scrollBehavior="normal"
        isDismissable={false}
        classNames={{
          wrapper: " overflow-hidden ",
          body: `py-6 bg-white rounded-xl `,
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "max-w-[95vw] w-full  border-gray-200 text-black",

          closeButton: "hover:bg-gray-500/5 active:bg-white/10",
        }}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalBody>
                <div className="flex border rounded-lg h-full">
                  {/* Left Sidebar - Topic Selection */}
                  <div className="w-2/3 border-r border-gray-200 ">
                    <div className="p-4 border-b border-gray-200 bg-white">
                      <QuestionSelector
                        maxNumQuestions={maxNumQuestions}
                        setMaxNumQuestions={setMaxNumQuestions}
                      />
                    </div>
                    <div className="p-4  ">
                      <QuestionSettings maxNumQuestions={maxNumQuestions} />
                    </div>
                  </div>

                  {/* Right Panel - Settings */}
                  <div className="w-1/3 flex flex-col">
                    <div className="flex-1 p-6 ">
                      <TestAdvancedSettings
                        selectedDifficulty={selectedDifficulty}
                        setSelectedDifficulty={setSelectedDifficulty}
                        maxNumQuestions={maxNumQuestions}
                      />
                    </div>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalGetMoreQuestion;
