
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Calendar as CalendarIcon, MapPin, Video, Phone, MessageSquare, UserSearch, IdCard } from 'lucide-react';
import { useHealthApp } from '@/contexts/HealthAppContext';
import { format, parseISO } from 'date-fns';
import { Doctor, TimeSlot, AppointmentType, OnlineConsultationType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export default function BookAppointment() {
  const { 
    filteredDoctors, 
    searchDoctors, 
    selectDoctor, 
    selectedDoctor, 
    selectedSlot,
    selectTimeSlot, 
    updateAppointmentForm,
    appointmentFormData,
    bookAppointment,
    timeSlots,
    doctors
  } = useHealthApp();

  const [searchInput, setSearchInput] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'id' | 'specialty'>('name');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Get unique specialties for the dropdown
  const uniqueSpecialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));

  // Handle search form submission with search type
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchType === 'specialty') {
      searchDoctors('', searchInput); // Pass empty string as query and specialty as second parameter
    } else {
      searchDoctors(searchInput); // Pass the search input as query
    }
  };

  // Filter time slots by doctor and date
  const getFilteredTimeSlots = () => {
    if (!selectedDoctor || !selectedDate) return [];
    
    return timeSlots
      .filter(slot => {
        const slotDate = parseISO(slot.startTime);
        const isSameDay = slotDate.getDate() === selectedDate.getDate() && 
                         slotDate.getMonth() === selectedDate.getMonth() && 
                         slotDate.getFullYear() === selectedDate.getFullYear();
        return slot.doctorId === selectedDoctor.id && isSameDay && !slot.isBooked;
      })
      .sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime());
  };
  
  // Get available time slots for the selected date and doctor
  const availableTimeSlots = getFilteredTimeSlots();

  // Render doctor cards
  const renderDoctorCard = (doctor: Doctor) => (
    <Card 
      key={doctor.id} 
      className={cn(
        "cursor-pointer transition-all hover:border-health-500",
        selectedDoctor?.id === doctor.id ? "border-health-500 ring-1 ring-health-500" : ""
      )}
      onClick={() => selectDoctor(doctor)}
    >
      <CardContent className="p-4 flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-lg">{doctor.name}</h3>
          <p className="text-muted-foreground text-sm">{doctor.specialty}</p>
          <div className="flex items-center mt-1">
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="text-sm">{doctor.rating}</span>
            </div>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-sm">{doctor.experience} yrs exp</span>
          </div>
          <div className="flex mt-2 space-x-2">
            {doctor.offlineAvailable && (
              <Badge variant="outline" className="text-xs">In-Person</Badge>
            )}
            {doctor.onlineAvailable && (
              <Badge variant="outline" className="text-xs">Online</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Handle appointment type selection
  const handleAppointmentTypeChange = (value: AppointmentType) => {
    updateAppointmentForm({ 
      type: value,
      onlineConsultationType: value === 'online' ? 'video' : undefined
    });
  };

  // Handle online consultation type selection
  const handleConsultationTypeChange = (value: OnlineConsultationType) => {
    updateAppointmentForm({ onlineConsultationType: value });
  };

  // Handle file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'prescription') => {
    if (!e.target.files?.length) return;
    
    // In a real app, you would upload these files to a server
    // For now, we'll just store the file name
    const files = Array.from(e.target.files);
    
    if (type === 'image') {
      // Convert file to base64 for preview (in a real app, you'd upload to a server)
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            updateAppointmentForm({
              images: [...appointmentFormData.images, e.target.result as string]
            });
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      // Store prescription file name
      updateAppointmentForm({
        prescription: files[0].name
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Book an Appointment</h1>
        <p className="text-muted-foreground">Find a doctor and schedule your appointment</p>
      </div>
      
      {/* Step 1: Search for a doctor with enhanced search options */}
      <Card>
        <CardHeader>
          <CardTitle>Search for a Doctor</CardTitle>
          <CardDescription>Find by name, ID, or specialty</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={searchType} onValueChange={(value) => setSearchType(value as 'name' | 'id' | 'specialty')}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Search by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">
                    <div className="flex items-center gap-2">
                      <UserSearch className="h-4 w-4" />
                      <span>Doctor Name</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="id">
                    <div className="flex items-center gap-2">
                      <IdCard className="h-4 w-4" />
                      <span>Doctor ID</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="specialty">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Specialty</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {searchType === 'specialty' ? (
                <Select 
                  value={searchInput}
                  onValueChange={setSearchInput}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select specialty..." />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueSpecialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  placeholder={`Search by ${searchType === 'name' ? 'doctor name' : 'doctor ID'}...`}
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1"
                />
              )}

              <Button type="submit" className="md:w-auto">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </form>
          
          <div className="mt-6 space-y-4">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map(renderDoctorCard)
            ) : (
              <p className="text-center py-4">No doctors found. Try a different search.</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Step 2: Select time slot (only visible when a doctor is selected) */}
      {selectedDoctor && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Select Appointment Date & Time</CardTitle>
            <CardDescription>Pick an available time slot for {selectedDoctor.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label className="mb-2 block">Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => {
                        // Disable dates more than 7 days in the future or in the past
                        const now = new Date();
                        const sevenDaysLater = new Date();
                        sevenDaysLater.setDate(now.getDate() + 7);
                        return date < now || date > sevenDaysLater;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label className="mb-2 block">Available Time Slots</Label>
                <div className="grid grid-cols-3 gap-2">
                  {selectedDate ? (
                    availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map((slot) => (
                        <Button
                          key={slot.id}
                          variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                          className="text-xs"
                          onClick={() => selectTimeSlot(slot)}
                        >
                          {format(parseISO(slot.startTime), 'h:mm a')}
                        </Button>
                      ))
                    ) : (
                      <p className="col-span-3 text-muted-foreground">No available slots on this day.</p>
                    )
                  ) : (
                    <p className="col-span-3 text-muted-foreground">Select a date first</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Step 3: Appointment Details (only visible when time slot is selected) */}
      {selectedDoctor && selectedSlot && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
            <CardDescription>Select appointment type and provide details</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={appointmentFormData.type} onValueChange={(v) => handleAppointmentTypeChange(v as AppointmentType)}>
              <TabsList className="grid w-full grid-cols-2">
                {selectedDoctor.offlineAvailable && (
                  <TabsTrigger value="offline" disabled={!selectedDoctor.offlineAvailable}>
                    <MapPin className="h-4 w-4 mr-2" /> In-Person Visit
                  </TabsTrigger>
                )}
                {selectedDoctor.onlineAvailable && (
                  <TabsTrigger value="online" disabled={!selectedDoctor.onlineAvailable}>
                    <Video className="h-4 w-4 mr-2" /> Online Consultation
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="offline" className="pt-4">
                {selectedDoctor.clinicAddress && (
                  <div className="mb-4">
                    <Label>Clinic Address</Label>
                    <div className="flex items-start mt-1">
                      <MapPin className="h-4 w-4 mt-0.5 mr-2 text-health-600" />
                      <p className="text-sm">{selectedDoctor.clinicAddress}</p>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="online" className="space-y-4 pt-4">
                <div>
                  <Label>Consultation Type</Label>
                  <RadioGroup 
                    defaultValue={appointmentFormData.onlineConsultationType || 'video'}
                    onValueChange={(v) => handleConsultationTypeChange(v as OnlineConsultationType)}
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="video" id="video" />
                      <Label htmlFor="video" className="flex items-center">
                        <Video className="h-4 w-4 mr-2" /> Video
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="phone" />
                      <Label htmlFor="phone" className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" /> Phone
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="text" id="text" />
                      <Label htmlFor="text" className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" /> Chat
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </TabsContent>
              
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="symptoms">Describe your symptoms or reason for visit</Label>
                  <Textarea 
                    id="symptoms"
                    placeholder="Please describe your symptoms in detail..."
                    value={appointmentFormData.notes}
                    onChange={(e) => updateAppointmentForm({ notes: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="images">Upload Images (Optional)</Label>
                    <Input 
                      id="images" 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={(e) => handleFileUpload(e, 'image')}
                    />
                    {appointmentFormData.images.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {appointmentFormData.images.map((image, i) => (
                          <div key={i} className="w-16 h-16 relative">
                            <img src={image} alt={`Uploaded ${i}`} className="w-full h-full object-cover rounded" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="prescription">Upload Previous Prescription (Optional)</Label>
                    <Input 
                      id="prescription" 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png" 
                      onChange={(e) => handleFileUpload(e, 'prescription')}
                    />
                    {appointmentFormData.prescription && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Uploaded: {appointmentFormData.prescription}
                      </p>
                    )}
                  </div>
                </div>
                
                <Button 
                  className="w-full md:w-auto" 
                  size="lg" 
                  onClick={bookAppointment}
                >
                  Confirm Appointment
                </Button>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
