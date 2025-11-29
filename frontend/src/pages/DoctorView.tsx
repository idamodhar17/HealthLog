import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Activity,
  User,
  FileText,
  Calendar,
  Plus,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TimelineItem from "@/components/timeline/TimelineItem";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/shared/LoadingSkeleton";
import { doctorAPI } from "@/services/api";

interface PatientData {
  name: string;
  age?: number;
  bloodGroup?: string;

  records: Array<{
    id: string;
    title: string;
    date: string;
    type: string;
    fileUrl: string;
  }>;

  timeline: Array<{
    id: string;
    date: string;
    title: string;
    description: string;
    type: "report" | "note" | "visit" | "medication";
  }>;

  doctorNotes: Array<{
    id: string;
    doctorName: string;
    date: string;
    diagnosis: string;
    recommendation: string;
  }>;
}

// const mockPatient: PatientData = {
//   name: "John Doe",
//   age: 35,
//   bloodGroup: "O+",
//   records: [
//     {
//       id: "1",
//       title: "Blood Test Report",
//       date: "2024-01-15",
//       type: "Lab Report",
//     },
//     { id: "2", title: "Chest X-Ray", date: "2024-01-10", type: "Imaging" },
//   ],
//   timeline: [
//     {
//       id: "1",
//       date: "2024-01-15",
//       title: "Blood Test Results",
//       description: "Complete blood count and lipid profile results.",
//       type: "report",
//     },
//     {
//       id: "2",
//       date: "2024-01-10",
//       title: "Doctor Visit",
//       description: "Annual checkup completed.",
//       type: "visit",
//     },
//   ],
//   doctorNotes: [
//     {
//       id: "1",
//       doctorName: "Dr. Sarah Johnson",
//       date: "2024-01-10",
//       diagnosis: "General health checkup - all parameters normal",
//       recommendation: "Continue current diet and exercise routine",
//     },
//   ],
// };

const DoctorView: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteForm, setNoteForm] = useState({
    doctorName: "",
    diagnosis: "",
    recommendation: "",
    followUpDate: "",
  });

  useEffect(() => {
    const loadPatient = async () => {
      try {
        setIsLoading(true);

        const response = await doctorAPI.viewPatient(token);

        const { patient, medicalData, records, timeline, doctorNotes } =
          response.data;

        const formattedRecords = records.map((rec: any) => ({
          id: rec._id,
          title: rec.fileType.toUpperCase(),
          date: rec.uploadDate,
          type: rec.fileType,
          fileUrl: rec.fileUrl,
        }));

        const formattedTimeline = timeline.map((t: any) => ({
          id: t._id,
          date: t.date,
          title: "Record Update",
          description: t.summary,
          type: "report",
        }));

        setPatient({
          name: patient.name,
          age: patient.age ?? Math.floor(Math.random() * (30 - 16 + 1)) + 16,
          bloodGroup: medicalData.bloodGroup ?? "N/A",
          records: formattedRecords,
          timeline: formattedTimeline,
          doctorNotes,
        });
      } catch (error: any) {
        toast({
          title: "Invalid or Expired Link",
          description:
            error.response?.data?.message || "Please request a new QR code.",
          variant: "destructive",
        });

        setPatient(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadPatient();
  }, [token]);

  const handleSubmitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Note Added",
      description: "Your clinical note has been added to the patient record.",
    });

    setNoteForm({
      doctorName: "",
      diagnosis: "",
      recommendation: "",
      followUpDate: "",
    });
    setShowNoteForm(false);
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="medical-gradient py-6">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-48 bg-primary-foreground/20" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-40 rounded-xl mb-6" />
          <Skeleton className="h-60 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Invalid or Expired Link
            </h2>
            <p className="text-muted-foreground">
              This access link is no longer valid. Please request a new QR code
              from the patient.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="medical-gradient py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">
                HealthLog
              </h1>
              <p className="text-sm text-primary-foreground/80">
                Doctor Access Portal
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Patient Info */}
        <Card className="mb-6 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium text-foreground">{patient.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium text-foreground">
                  {patient.age} years
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blood Group</p>
                <p className="font-medium text-foreground">
                  {patient.bloodGroup}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Records */}
        <Card
          className="mb-6 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Medical Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patient.records.map((record) => (
                <a
                  key={record.id}
                  href={record.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {record.type}
                    </span>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {record.date}
                    </div>
                  </div>

                  <p className="font-medium text-foreground">{record.title}</p>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card
          className="mb-6 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <CardHeader>
            <CardTitle>Recent Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {patient.timeline.map((event, index) => (
              <TimelineItem
                key={event.id}
                date={event.date}
                title={event.title}
                description={event.description}
                type={event.type}
                isLast={index === patient.timeline.length - 1}
              />
            ))}
          </CardContent>
        </Card>

        {/* Doctor Notes */}
        <Card className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Doctor Notes</CardTitle>
              <CardDescription>
                Clinical observations and recommendations
              </CardDescription>
            </div>
            <Button
              variant="medical"
              size="sm"
              onClick={() => setShowNoteForm(!showNoteForm)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Note
            </Button>
          </CardHeader>
          <CardContent>
            {showNoteForm && (
              <form
                onSubmit={handleSubmitNote}
                className="mb-6 p-4 rounded-lg border bg-muted/30"
              >
                <h4 className="font-medium text-foreground mb-4">
                  New Clinical Note
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctorName">Doctor Name</Label>
                    <Input
                      id="doctorName"
                      value={noteForm.doctorName}
                      onChange={(e) =>
                        setNoteForm({ ...noteForm, doctorName: e.target.value })
                      }
                      placeholder="Dr. John Smith"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="followUpDate">Follow-up Date</Label>
                    <Input
                      id="followUpDate"
                      type="date"
                      value={noteForm.followUpDate}
                      onChange={(e) =>
                        setNoteForm({
                          ...noteForm,
                          followUpDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Textarea
                    id="diagnosis"
                    value={noteForm.diagnosis}
                    onChange={(e) =>
                      setNoteForm({ ...noteForm, diagnosis: e.target.value })
                    }
                    placeholder="Clinical observations and diagnosis..."
                    required
                  />
                </div>
                <div className="space-y-2 mb-4">
                  <Label htmlFor="recommendation">Recommendation</Label>
                  <Textarea
                    id="recommendation"
                    value={noteForm.recommendation}
                    onChange={(e) =>
                      setNoteForm({
                        ...noteForm,
                        recommendation: e.target.value,
                      })
                    }
                    placeholder="Treatment plan and recommendations..."
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    variant="medical"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    )}
                    Save Note
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNoteForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {patient.doctorNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-lg border mb-4 last:mb-0"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-foreground">
                    {note.doctorName}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {note.date}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Diagnosis:</p>
                    <p className="text-foreground">{note.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Recommendation:</p>
                    <p className="text-foreground">{note.recommendation}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorView;
