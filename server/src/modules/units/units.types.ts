export type UnitInput = {
  building_id: number;
  floor_id?: number;
  unit_number: string;
  unit_type: "SHOP" | "OFFICE" | "ROOM" | "OTHER";
  name?: string;
  description?: string;
  monthly_rent: number;
  status?: "VACANT" | "OCCUPIED" | "RESERVED" | "MAINTENANCE";
};
export type UnitPatch = Partial<UnitInput>;
