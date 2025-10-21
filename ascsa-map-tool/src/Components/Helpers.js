import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import { bboxPolygon } from "@turf/bbox-polygon";

export function applyBoundFilter(data, bbox) {
  return data.filter((f) => {
    const p = point(f.geometry.coordinates);
    return booleanPointInPolygon(p, bbox);
  });
}

export function calculateBounds(bounds) {
  const northEast = bounds.getNorthEast();
  const southWest = bounds.getSouthWest();
  const bboxList = [
    southWest.lng, // West
    southWest.lat, // South
    northEast.lng, // East
    northEast.lat, // North
  ];

  return bboxPolygon(bboxList);
}

export function applySectionFilter(data, f) {
  if (!isSectionEmpty(f.section)) {
    const sectionFilter = getSectionFilter(f.section);
    return data.filter((d) => d[sectionFilter] == f.section[sectionFilter]);
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
  return newActiveData.filter((f) => filters.periods.includes(f.Era));
}

export function applyMonumentFilter(newActiveData, monumentData, monumentsVisibility, filters) {
  let mData = [];
  if (monumentsVisibility != "No") {
    const conditions = filters.monument.Condition || [];

    if (!isArrayEmpty(conditions)) {
      mData = monumentData.filter((f) => conditions.includes(f.CleanCondition));
    } else {
      mData = monumentData;
    }

    newActiveData.push(...mData);
  }

  return newActiveData;
}

export function applyInventoryFilter(newActiveData, filters) {
  return newActiveData.filter((f) =>
    filters.inventory.includes(f.InventoryNumberLetter)
  );
}

export function applyMaterialFilter(newActiveData, filters) {
  return newActiveData.filter((f) =>
    filters.materials.some((material) => f.MaterialCategory.includes(material))
  );
}

export function isSectionEmpty(section) {
  return section.SectionNumber === "" ? true : false;
}

export function isArrayEmpty(arr) {
  return arr.length == 0 ? true : false;
}

export function isTextSearchFilterEmpty(filter) {
  return filter.includeInput == "" && filter.excludeInput == "";
}

export function hasTextSearchFilterChanged(currentFilter, prevFilter) {
  const textHasChanged =
    currentFilter.includeInput != prevFilter.includeInput ||
    currentFilter.excludeInput != prevFilter.excludeInput;

  if (textHasChanged) return true;

  const limitHasChanged = currentFilter.limit != prevFilter.limit;
  if (limitHasChanged) return true;

  return false;
}

export function getCurrentDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    second: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${date}, ${time}`;
}

export function generateRandomIdUrlSafe(len = 16) {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes)
    .map((b) => ("0" + (b & 0xff).toString(36)).slice(-2))
    .join("")
    .slice(0, len);
}

const iconExHTMLClass = ".leaflet-iconex";
export function setOpacityOfDOMMarkers(op) {
  const domIconElements = document.querySelectorAll(iconExHTMLClass);
  domIconElements.forEach((icon) => {
    icon.style.opacity = op;
  });
}
