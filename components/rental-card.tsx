"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Euro,
  Users,
  Phone,
  Mail,
  Info,
  Train,
  Footprints as Walk,
} from "lucide-react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import type { Rental } from "@/lib/api";

interface RentalCardProps {
  rental: Rental;
  onClick: () => void;
}

export function RentalCard({ rental, onClick }: RentalCardProps) {
  const formatPropertyType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatTenantPreference = (preference: string) => {
    return preference
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatMinutes = (minutes?: number) =>
    minutes !== undefined ? `${Math.round(minutes)} min` : "-";

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 h-full"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Euro className="h-5 w-5" />
            {rental.price}
            <span className="text-sm font-normal text-muted-foreground">
              /month
            </span>
          </div>
          <Badge variant="secondary">
            {formatPropertyType(rental.property_type)}
          </Badge>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {rental.location}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm line-clamp-2">{rental.summary}</p>

        <div className="flex flex-wrap gap-2">
          {rental.num_bedrooms && (
            <Badge variant="outline" className="text-xs">
              {rental.num_bedrooms} bed{rental.num_bedrooms > 1 ? "s" : ""}
            </Badge>
          )}
          {rental.num_bathrooms && (
            <Badge variant="outline" className="text-xs">
              {rental.num_bathrooms} bath{rental.num_bathrooms > 1 ? "s" : ""}
            </Badge>
          )}
          {rental.flatmates_count !== undefined &&
            rental.flatmates_count > 0 && (
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {rental.flatmates_count} flatmates
              </Badge>
            )}
          {rental.has_extra_expenses && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Badge
                  variant="destructive"
                  className="text-xs flex items-center gap-1"
                >
                  <Info className="h-3 w-3" />
                  Extra expenses
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent className="text-xs max-w-xs">
                {rental.extra_expenses_details || "See details with the owner"}
              </HoverCardContent>
            </HoverCard>
          )}
        </div>

        {rental.tenant_preference &&
          rental.tenant_preference !== "indifferente" && (
            <Badge variant="outline" className="text-xs">
              {formatTenantPreference(rental.tenant_preference)}
            </Badge>
          )}

        {/* Transit & Walking Times */}
        {(rental.duration_to_leonardo_transit ||
          rental.duration_to_bovisa_transit ||
          rental.duration_to_leonardo_walking ||
          rental.duration_to_bovisa_walking) && (
          <div className="flex flex-col gap-1 pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Train className="h-4 w-4" />
              <span>
                Leonardo: {formatMinutes(rental.duration_to_leonardo_transit)}
              </span>
              <span className="mx-2">|</span>
              Bovisa: {formatMinutes(rental.duration_to_bovisa_transit)}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Walk className="h-4 w-4" />
              <span>
                Leonardo: {formatMinutes(rental.duration_to_leonardo_walking)}
              </span>
              <span className="mx-2">|</span>
              Bovisa: {formatMinutes(rental.duration_to_bovisa_walking)}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          {rental.telephone && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              Available
            </div>
          )}
          {rental.email && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              Available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
