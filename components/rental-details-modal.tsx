import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Euro,
  Users,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  User,
  Bed,
  Bath,
  Train,
  Footprints as Walk,
} from "lucide-react";
import type { Rental } from "@/lib/api";

interface RentalDetailsModalProps {
  rental: Rental | null;
  open: boolean;
  onClose: () => void;
}

export function RentalDetailsModal({
  rental,
  open,
  onClose,
}: RentalDetailsModalProps) {
  if (!rental) return null;

  const formatPropertyType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatTenantPreference = (preference?: string) => {
    if (!preference) return "";
    return preference
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMinutes = (minutes?: number) =>
    minutes !== undefined ? `${Math.round(minutes)} min` : "-";

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
      aria-label="Rental details dialog"
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Euro className="h-5 w-5 text-primary" />€{rental.price}/month -{" "}
            {rental.location}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Type and Tenant Preference */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-sm">
              {formatPropertyType(rental.property_type)}
            </Badge>
            {rental.tenant_preference !== "indifferente" && (
              <Badge variant="outline" className="text-sm">
                {formatTenantPreference(rental.tenant_preference)}
              </Badge>
            )}
          </div>

          {/* Summary */}
          <div>
            <h3 className="font-semibold mb-2">Summary</h3>
            <p className="text-sm text-muted-foreground">{rental.summary}</p>
          </div>

          <Separator />

          {/* Property Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rental.num_bedrooms && (
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {rental.num_bedrooms} bedroom
                  {rental.num_bedrooms > 1 ? "s" : ""}
                </span>
              </div>
            )}
            {rental.num_bathrooms && (
              <div className="flex items-center gap-2">
                <Bath className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {rental.num_bathrooms} bathroom
                  {rental.num_bathrooms > 1 ? "s" : ""}
                </span>
              </div>
            )}
            {rental.flatmates_count !== undefined &&
              rental.flatmates_count > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {rental.flatmates_count} flatmates
                  </span>
                </div>
              )}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{rental.location}</span>
            </div>
          </div>

          {/* Extra Expenses */}
          {rental.has_extra_expenses && (
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="destructive"
                className="text-xs flex items-center gap-1"
              >
                <MessageSquare className="h-3 w-3" />
                Extra expenses
              </Badge>
              <span className="text-xs text-muted-foreground">
                {rental.extra_expenses_details || "See details with the owner"}
              </span>
            </div>
          )}

          <Separator />

          {/* Availability */}
          {(rental.availability_start || rental.availability_end) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Available:{" "}
              {rental.availability_start
                ? new Date(rental.availability_start).toLocaleDateString()
                : "?"}
              {" - "}
              {rental.availability_end
                ? new Date(rental.availability_end).toLocaleDateString()
                : "?"}
            </div>
          )}

          <Separator />

          {/* Transit & Walking Times */}
          {(rental.duration_to_leonardo_transit ||
            rental.duration_to_bovisa_transit ||
            rental.duration_to_leonardo_walking ||
            rental.duration_to_bovisa_walking) && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Train className="h-5 w-5" />
                <span>
                  <b>Leonardo transit:</b>{" "}
                  {formatMinutes(rental.duration_to_leonardo_transit)}
                </span>
                <span className="mx-2">|</span>
                <span>
                  <b>Bovisa transit:</b>{" "}
                  {formatMinutes(rental.duration_to_bovisa_transit)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Walk className="h-5 w-5" />
                <span>
                  <b>Leonardo walking:</b>{" "}
                  {formatMinutes(rental.duration_to_leonardo_walking)}
                </span>
                <span className="mx-2">|</span>
                <span>
                  <b>Bovisa walking:</b>{" "}
                  {formatMinutes(rental.duration_to_bovisa_walking)}
                </span>
              </div>
            </div>
          )}

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-3">Contact Information</h3>
            <div className="space-y-3">
              {rental.sender_username && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`https://t.me/${rental.sender_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    @{rental.sender_username}
                  </a>
                </div>
              )}
              {rental.telephone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Button variant="link" className="p-0 h-auto text-sm" asChild>
                    <a href={`tel:${rental.telephone}`}>{rental.telephone}</a>
                  </Button>
                </div>
              )}
              {rental.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Button variant="link" className="p-0 h-auto text-sm" asChild>
                    <a href={`mailto:${rental.email}`}>{rental.email}</a>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Message Details */}
          <div>
            <h3 className="font-semibold mb-3">Message Details</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Posted: {formatDate(rental.message_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Message ID: {rental.telegram_message_id}</span>
              </div>
            </div>
          </div>

          {/* Raw Text */}
          {rental.raw_text && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Original Message</h3>
                <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap">
                  {rental.raw_text}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
