import React from 'react';
import { Download, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import { Button } from './ui/button';
import * as XLSX from 'xlsx';

const ResultsModal = ({ questions, userAnswers, onClose }) => {
  const calculateResults = () => {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;
    let totalScore = 0;

    const results = questions.map((q) => {
      const userAnswer = userAnswers[q.id];
      const correctAnswer = q.correctAnswer;
      let flag = 0;
      let status = 'unanswered';

      if (!userAnswer) {
        unanswered++;
        status = 'unanswered';
        flag = 0;
      } else if (userAnswer === correctAnswer) {
        correct++;
        status = 'correct';
        flag = 2;
        totalScore += 2;
      } else {
        wrong++;
        status = 'wrong';
        flag = -0.5;
        totalScore -= 0.5;
      }

      return {
        questionId: q.id,
        question: q.question,
        userAnswer: userAnswer || 'Not Attempted',
        correctAnswer,
        status,
        flag,
      };
    });

    return { correct, wrong, unanswered, totalScore, results };
  };

  const { correct, wrong, unanswered, totalScore, results } = calculateResults();

  const exportToExcel = () => {
    const exportData = results.map((r) => ({
      'Question No': r.questionId,
      Question: r.question,
      'Your Answer': r.userAnswer,
      'Correct Answer': r.correctAnswer,
      Flag: r.flag,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Exam Results');

    // Set column widths
    worksheet['!cols'] = [
      { wch: 12 },
      { wch: 60 },
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
    ];

    XLSX.writeFile(workbook, `CAT_Exam_Results_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Results Header */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Exam Results</h1>
            <p className="text-slate-600">Here's how you performed</p>
          </div>

          {/* Score Summary */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-emerald-600">{correct}</div>
              <div className="text-sm text-emerald-700 font-medium mt-1">Correct</div>
            </div>
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-600">{wrong}</div>
              <div className="text-sm text-red-700 font-medium mt-1">Wrong</div>
            </div>
            <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-slate-600">{unanswered}</div>
              <div className="text-sm text-slate-700 font-medium mt-1">Unanswered</div>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{totalScore.toFixed(1)}</div>
              <div className="text-sm text-blue-700 font-medium mt-1">Total Score</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={exportToExcel}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export to Excel
            </Button>
            <Button onClick={onClose} variant="outline">
              Take New Exam
            </Button>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Question-wise Analysis</h2>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={result.questionId}
                className={`border-2 rounded-lg p-4 ${
                  result.status === 'correct'
                    ? 'border-emerald-200 bg-emerald-50'
                    : result.status === 'wrong'
                    ? 'border-red-200 bg-red-50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {result.status === 'correct' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                    {result.status === 'wrong' && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    {result.status === 'unanswered' && (
                      <MinusCircle className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800 mb-2">
                      Q{result.questionId}. {result.question}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Your Answer: </span>
                        <span
                          className={`font-semibold ${
                            result.status === 'correct'
                              ? 'text-emerald-700'
                              : result.status === 'wrong'
                              ? 'text-red-700'
                              : 'text-slate-700'
                          }`}
                        >
                          {result.userAnswer}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600">Correct Answer: </span>
                        <span className="font-semibold text-emerald-700">
                          {result.correctAnswer}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div
                      className={`px-3 py-1 rounded-full font-semibold text-sm ${
                        result.status === 'correct'
                          ? 'bg-emerald-600 text-white'
                          : result.status === 'wrong'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-600 text-white'
                      }`}
                    >
                      {result.flag > 0 ? `+${result.flag}` : result.flag}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;