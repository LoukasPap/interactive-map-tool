import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";

export function applyBoundFilter(data, bbox) {
  return data.filter((f) => {
    const p = point(f.geometry.coordinates);
    return booleanPointInPolygon(p, bbox);
  });
}

export function applySectionFilter(data, f) {
  if (!isSectionEmpty(f.section)) {
    const sectionFilter = getSectionFilter(f.section);
    return data.filter(
      (d) => d[sectionFilter] == f.section[sectionFilter]
    );
  }

  return data;
}

export function getSectionFilter(section) {
  if (
    section.SectionNumberLetter !== "" &&
    section.SectionNumberNumber !== ""
  ) {
    return "SectionNumber";
  } else if (section.SectionNumberLetter !== "") {
    return "SectionNumberLetter";
  } else {
    return "SectionNumberNumber";
  }
}

export function applyPeriodFilter(newActiveData, filters) {
  return newActiveData.filter((f) =>
    filters.periods.includes(f.Era)
  );
}

export function applyMonumentFilter(newActiveData, monumentData, monumentsVisibility, filters) {
  let mData = [];
  if (monumentsVisibility != "No") {
    const conditions = filters.monument.Condition || [];

    if (!isArrayEmpty(conditions)) {
      mData = monumentData.features.filter((f) =>
        conditions.includes(f.CleanCondition)
      );
    } else {
      mData = monumentData.features;
    }
  }
  newActiveData.push(...mData);
  return newActiveData;
}

export function applyInventoryFilter(newActiveData, filters) {
  return newActiveData.filter((f) =>
      filters.inventory.includes(f.InventoryNumberLetter)
  );
}

export function applyMaterialFilter(newActiveData, filters) {
  return newActiveData.filter((f) =>
    filters.materials.some((material) =>
      f.MaterialCategory.includes(material)
    )
  );
}

export function isSectionEmpty(section) {
  return section.SectionNumber === "" ? true : false;
}

export function isArrayEmpty(arr) {
  return arr.length == 0 ? true : false;
}
