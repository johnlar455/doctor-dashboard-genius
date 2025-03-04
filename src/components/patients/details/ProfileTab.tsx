
import React from "react";
import { format, parseISO } from "date-fns";

interface ProfileTabProps {
  patient: any;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ patient }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Personal Information</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2">
              <div className="text-muted-foreground">Full Name</div>
              <div>{patient.name}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-muted-foreground">Date of Birth</div>
              <div>{formatDate(patient.date_of_birth)}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-muted-foreground">Gender</div>
              <div>{patient.gender}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-muted-foreground">Blood Type</div>
              <div>{patient.blood_type || 'Not specified'}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Contact Information</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2">
              <div className="text-muted-foreground">Email</div>
              <div>{patient.email}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-muted-foreground">Phone</div>
              <div>{patient.phone}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-muted-foreground">Address</div>
              <div>{patient.address || 'Not specified'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-muted-foreground">Emergency Contact</div>
              <div>{patient.emergency_contact || 'Not specified'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
