import type { ComponentProps } from "react";
import { Select } from "@/components/ui/Field";
import { places, type Region } from "@/data/places";

const byRegion = places.reduce<Partial<Record<Region, typeof places>>>((groups, place) => {
  (groups[place.region] ??= []).push(place);
  return groups;
}, {});

type Props = Omit<ComponentProps<typeof Select>, "children"> & { placeholder: string };

/** City/airport picker grouped by region. Values are IATA codes. */
export function PlaceSelect({ placeholder, ...props }: Props) {
  return (
    <Select {...props}>
      <option value="" disabled>
        {placeholder}
      </option>
      {Object.entries(byRegion).map(([region, list]) => (
        <optgroup key={region} label={region}>
          {list.map((place) => (
            <option key={place.code} value={place.code}>
              {place.city} ({place.code})
            </option>
          ))}
        </optgroup>
      ))}
    </Select>
  );
}
