import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, User, Droplet, AlertTriangle, Pill, Phone, Plus, X, Loader2, Save } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/shared/LoadingSkeleton';
import { iceAPI } from '@/services/api';

interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const ICEProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: '',
    allergies: [] as string[],
    medicalConditions: '',
    currentMedications: '',
    emergencyContacts: [] as EmergencyContact[],
  });
  const [allergyInput, setAllergyInput] = useState('');

  useEffect(() => {
    // Note: Backend doesn't have a get profile endpoint
    // Profile is loaded when generating QR or can be set initially
    setIsLoading(false);
  }, []);

  const handleAddAllergy = () => {
    if (allergyInput.trim() && !formData.allergies.includes(allergyInput.trim())) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, allergyInput.trim()],
      });
      setAllergyInput('');
    }
  };

  const handleRemoveAllergy = (allergy: string) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter((a) => a !== allergy),
    });
  };

  const handleAddContact = () => {
    setFormData({
      ...formData,
      emergencyContacts: [
        ...formData.emergencyContacts,
        { id: Date.now().toString(), name: '', relation: '', phone: '' },
      ],
    });
  };

  const handleRemoveContact = (id: string) => {
    setFormData({
      ...formData,
      emergencyContacts: formData.emergencyContacts.filter((c) => c.id !== id),
    });
  };

  const handleContactChange = (id: string, field: string, value: string) => {
    setFormData({
      ...formData,
      emergencyContacts: formData.emergencyContacts.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.bloodGroup) {
      toast({
        title: 'Validation Error',
        description: 'Name and Blood Group are required.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      // Convert frontend format to backend format
      const backendData = {
        name: formData.name,
        bloodGroup: formData.bloodGroup,
        allergies: formData.allergies.length > 0 ? formData.allergies.join(', ') : undefined,
        medications: formData.currentMedications || undefined,
        emergencyContacts: formData.emergencyContacts.length > 0 
          ? formData.emergencyContacts[0] // Backend expects single contact object
          : undefined,
      };

      await iceAPI.saveProfile(backendData);
      
      toast({
        title: 'Profile Saved',
        description: 'Your emergency profile has been updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Save Failed',
        description: error.response?.data?.message || 'Failed to save profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <PageContainer title="Emergency Profile" showBack backTo="/dashboard">
          <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-60 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageContainer
        title="Emergency Profile (ICE)"
        subtitle="Critical information for first responders"
        showBack
        backTo="/dashboard"
        headerAction={
          <Button variant="medical" onClick={() => navigate('/ice/qr')}>
            View QR Code
          </Button>
        }
      >
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Basic Info */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Allergies */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Allergies
              </CardTitle>
              <CardDescription>
                Important: List all known allergies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  placeholder="Enter allergy (e.g., Penicillin)"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAllergy()}
                />
                <Button variant="outline" onClick={handleAddAllergy}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.allergies.map((allergy) => (
                  <span
                    key={allergy}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm"
                  >
                    {allergy}
                    <button
                      onClick={() => handleRemoveAllergy(allergy)}
                      className="hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {formData.allergies.length === 0 && (
                  <p className="text-sm text-muted-foreground">No allergies listed</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Medical Conditions */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Medical Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.medicalConditions}
                onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                placeholder="List chronic conditions, past surgeries, etc."
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-success" />
                Current Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.currentMedications}
                onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                placeholder="List medications with dosages"
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-secondary" />
                  Emergency Contacts
                </CardTitle>
                <CardDescription>People to contact in case of emergency</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleAddContact}>
                <Plus className="h-4 w-4 mr-1" />
                Add Contact
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.emergencyContacts.map((contact, index) => (
                <div key={contact.id} className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">
                      Contact {index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveContact(contact.id)}
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      placeholder="Name"
                      value={contact.name}
                      onChange={(e) => handleContactChange(contact.id, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="Relation"
                      value={contact.relation}
                      onChange={(e) => handleContactChange(contact.id, 'relation', e.target.value)}
                    />
                    <Input
                      placeholder="Phone"
                      value={contact.phone}
                      onChange={(e) => handleContactChange(contact.id, 'phone', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              {formData.emergencyContacts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No emergency contacts added
                </p>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            variant="medical"
            size="lg"
            className="w-full"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Emergency Profile
              </>
            )}
          </Button>
        </div>
      </PageContainer>
    </div>
  );
};

export default ICEProfile;
