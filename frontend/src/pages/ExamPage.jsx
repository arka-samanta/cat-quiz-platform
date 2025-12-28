import React, { useState, useEffect } from 'react';
import { Clock, Send } from 'lucide-react';
import { mockQuestions } from '../mock';
import QuestionDisplay from '../components/QuestionDisplay';
import QuestionNavigation from '../components/QuestionNavigation';
import ResultsModal from '../components/ResultsModal';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';

const ExamPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [questionStatus, setQuestionStatus] = useState({});
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const { toast } = useToast();

  // Timer countdown
  useEffect(() => {
    if (examSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examSubmitted]);

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAutoSubmit = () => {
    toast({
      title: "Time's Up!",
      description: "Your exam has been automatically submitted.",
    });
    setExamSubmitted(true);
  };

  const handleSubmitExam = () => {
    setShowSubmitDialog(true);
  };

  const confirmSubmit = () => {
    setExamSubmitted(true);
    setShowSubmitDialog(false);
    toast({
      title: "Exam Submitted",
      description: "Your answers have been recorded successfully.",
    });
  };

  const handleQuestionClick = (index) => {
    // Mark current question as visited if not already
    const questionId = mockQuestions[currentQuestionIndex].id;
    if (!questionStatus[questionId]) {
      setQuestionStatus((prev) => ({
        ...prev,
        [questionId]: 'visited',
      }));
    }
    setCurrentQuestionIndex(index);
  };

  const handleSaveAndNext = () => {
    const questionId = mockQuestions[currentQuestionIndex].id;
    const hasAnswer = userAnswers[questionId];

    if (hasAnswer) {
      setQuestionStatus((prev) => ({
        ...prev,
        [questionId]: 'answered',
      }));
    } else {
      setQuestionStatus((prev) => ({
        ...prev,
        [questionId]: 'visited',
      }));
    }

    // Move to next question
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleMarkForReview = () => {
    const questionId = mockQuestions[currentQuestionIndex].id;
    const hasAnswer = userAnswers[questionId];

    if (hasAnswer) {
      setQuestionStatus((prev) => ({
        ...prev,
        [questionId]: 'answered-marked',
      }));
    } else {
      setQuestionStatus((prev) => ({
        ...prev,
        [questionId]: 'marked',
      }));
    }

    // Move to next question
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleClearSelection = () => {
    const questionId = mockQuestions[currentQuestionIndex].id;
    setUserAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });

    // Update status to visited
    setQuestionStatus((prev) => ({
      ...prev,
      [questionId]: 'visited',
    }));

    toast({
      title: "Selection Cleared",
      description: "Your answer has been cleared for this question.",
    });
  };

  const handleAnswerSelect = (optionId) => {
    const questionId = mockQuestions[currentQuestionIndex].id;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  if (examSubmitted) {
    return (
      <ResultsModal
        questions={mockQuestions}
        userAnswers={userAnswers}
        onClose={() => {
          // Reset exam
          setExamSubmitted(false);
          setCurrentQuestionIndex(0);
          setUserAnswers({});
          setQuestionStatus({});
          setTimeLeft(60 * 60);
        }}
      />
    );
  }

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestion.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">CAT Exam 2025</h1>
              <p className="text-sm text-slate-600 mt-1">Section: Quantitative Aptitude & Reasoning</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5 text-slate-700" />
                <span className={`text-lg font-semibold ${
                  timeLeft < 300 ? 'text-red-600' : 'text-slate-800'
                }`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Button
                onClick={handleSubmitExam}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Exam
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Question Display - 80% */}
          <div className="flex-1">
            <QuestionDisplay
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              onAnswerSelect={handleAnswerSelect}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={mockQuestions.length}
            />

            {/* Action Buttons */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center">
                <Button
                  onClick={handleMarkForReview}
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  Mark for Review & Next
                </Button>
                <Button
                  onClick={handleClearSelection}
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Clear Selection
                </Button>
                <Button
                  onClick={handleSaveAndNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save & Next
                </Button>
              </div>
            </div>
          </div>

          {/* Question Navigation - 20% */}
          <div className="w-[280px]">
            <QuestionNavigation
              questions={mockQuestions}
              currentQuestionIndex={currentQuestionIndex}
              questionStatus={questionStatus}
              userAnswers={userAnswers}
              onQuestionClick={handleQuestionClick}
            />
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Submit Exam?</h2>
            <p className="text-slate-600 mb-6">
              Are you sure you want to submit the exam? You won't be able to change your answers after submission.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => setShowSubmitDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmSubmit}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Yes, Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPage;