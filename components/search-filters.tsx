"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Search, RotateCcw } from "lucide-react";
import type { RentalFilters } from "@/lib/api";

interface SearchFiltersProps {
  onSearch: (filters: RentalFilters) => void;
}

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState<string>("any_type");
  const [tenantPreference, setTenantPreference] =
    useState<string>("any_preference");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [minBedrooms, setMinBedrooms] = useState<string>("any");
  const [minBathrooms, setMinBathrooms] = useState<string>("any");

  const handleSearch = () => {
    const filters: RentalFilters = {};

    if (location.trim()) filters.location = location.trim();
    if (propertyType !== "any_type") filters.property_type = propertyType;
    if (tenantPreference !== "any_preference")
      filters.tenant_preference = tenantPreference;
    if (priceRange[0] > 0) filters.min_price = priceRange[0];
    if (priceRange[1] < 2000) filters.max_price = priceRange[1];
    if (minBedrooms !== "any")
      filters.min_bedrooms = Number.parseInt(minBedrooms);
    if (minBathrooms !== "any")
      filters.min_bathrooms = Number.parseInt(minBathrooms);

    onSearch(filters);
  };

  const handleReset = () => {
    setLocation("");
    setPropertyType("any_type");
    setTenantPreference("any_preference");
    setPriceRange([0, 2000]);
    setMinBedrooms("any");
    setMinBathrooms("any");
    onSearch({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g., Città Studi, Milano"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label>Property Type</Label>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger>
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any_type">Any type</SelectItem>
              <SelectItem value="camera_singola">Single Room</SelectItem>
              <SelectItem value="camera_doppia">Double Room</SelectItem>
              <SelectItem value="appartamento">Apartment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tenant Preference */}
        <div className="space-y-2">
          <Label>Tenant Preference</Label>
          <Select value={tenantPreference} onValueChange={setTenantPreference}>
            <SelectTrigger>
              <SelectValue placeholder="Any preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any_preference">Any preference</SelectItem>
              <SelectItem value="ragazza">Female</SelectItem>
              <SelectItem value="ragazzo">Male</SelectItem>
              <SelectItem value="indifferente">No preference</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label>Price Range (€/month)</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={2000}
              min={0}
              step={50}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>€{priceRange[0]}</span>
            <span>€{priceRange[1]}</span>
          </div>
        </div>

        {/* Bedrooms */}
        <div className="space-y-2">
          <Label>Minimum Bedrooms</Label>
          <Select value={minBedrooms} onValueChange={setMinBedrooms}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bathrooms */}
        <div className="space-y-2">
          <Label>Minimum Bathrooms</Label>
          <Select value={minBathrooms} onValueChange={setMinBathrooms}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSearch} className="flex-1">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
