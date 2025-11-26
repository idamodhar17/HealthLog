import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import { ocrAPI } from "@/services/api";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";

const AISummary: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [error, setError] = useState("");

  const generateSummary = async () => {
    try {
      setError("");
      setLoading(true);
      setSummary(null);

      const res = await ocrAPI.getExtractedText();
      const allTexts = res.data.records
        .map((r: any) => r.extractedText)
        .join("\n\n");

      if (!allTexts || allTexts.trim().length < 10) {
        setError("Not enough OCR text found to generate summary.");
        setLoading(false);
        return;
      }

      const aiRes = await axios.post("http://localhost:8001/summarize", {
        text: allTexts,
      });

      setSummary(JSON.parse(aiRes.data.summary));
    } catch (err) {
      setError("Failed to generate AI summary. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-background dark:to-background">
      <Navbar />

      <PageContainer>
        {/* Header */}
        <div className="mb-10 text-center animate-fadeIn">
          <h1 className="text-4xl font-bold mb-3 tracking-tight">
            AI Health Summary
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Automatically generate a clean and accurate summary of your medical
            reports using AI.
          </p>
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <button
            onClick={generateSummary}
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl shadow-lg hover:scale-[1.03] hover:shadow-primary/30 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
            {loading ? "Analyzing your reports..." : "Generate AI Summary"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 mt-6 text-center font-medium">
            {error}
          </p>
        )}

        {/* Skeleton Loader */}
        {loading && (
          <div className="max-w-3xl mx-auto mt-10 p-6 animate-pulse">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        )}

        {/* AI Summary */}
        {summary && (
          <Card className="mt-10 max-w-3xl mx-auto backdrop-blur-xl bg-white/70 dark:bg-black/30 border border-primary/20 shadow-xl animate-fadeInUp">
            <CardContent className="p-8 space-y-8">
              <h2 className="text-2xl font-semibold text-primary text-center">
                Your AI Health Summary
              </h2>

              {/* Section Component */}
              {[
                ["Diagnosis", summary.diagnosis],
                ["Medications", summary.medications],
                ["Lab Summary", summary.lab_summary],
                ["Doctor Recommendations", summary.recommendations],
                ["Follow Up", summary.follow_up],
                ["Warnings", summary.warnings],
              ].map(([title, content], idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-lg font-bold">{title}</h3>

                  {title === "Medications" && Array.isArray(content) ? (
                    content.length > 0 ? (
                      <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                        {content.map((m: any, i: number) => (
                          <li key={i}>
                            <strong>{m.name}</strong> — {m.dose}, {m.frequency}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">
                        No medications listed.
                      </p>
                    )
                  ) : (
                    <p className="text-muted-foreground">
                      {content || "N/A"}
                    </p>
                  )}

                  {idx !== 5 && (
                    <div className="border-b border-gray-300/40 my-4"></div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </PageContainer>
    </div>
  );
};

export default AISummary;